import os
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from PIL import Image

class ResidualDenseBlock(nn.Module):
    def __init__(self, num_feat=64, num_grow_ch=32):
        super().__init__()
        self.conv1 = nn.Conv2d(num_feat, num_grow_ch, 3, 1, 1)
        self.conv2 = nn.Conv2d(num_feat + num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv3 = nn.Conv2d(num_feat + 2 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv4 = nn.Conv2d(num_feat + 3 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv5 = nn.Conv2d(num_feat + 4 * num_grow_ch, num_feat, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x

class RRDB(nn.Module):
    def __init__(self, num_feat, num_grow_ch=32):
        super().__init__()
        self.rdb1 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb2 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb3 = ResidualDenseBlock(num_feat, num_grow_ch)

    def forward(self, x):
        out = self.rdb1(x)
        out = self.rdb2(out)
        out = self.rdb3(out)
        return out * 0.2 + x

class RRDBNet(nn.Module):
    def __init__(self, num_in_ch=3, num_out_ch=3, scale=4, num_feat=64, num_block=23, num_grow_ch=32):
        super().__init__()
        self.scale = scale
        self.conv_first = nn.Conv2d(num_in_ch, num_feat, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(num_feat, num_grow_ch) for _ in range(num_block)])
        self.conv_body = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_hr = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_last = nn.Conv2d(num_feat, num_out_ch, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        feat = self.conv_first(x)
        body_feat = self.conv_body(self.body(feat))
        feat = feat + body_feat
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode='nearest')))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode='nearest')))
        out = self.conv_last(self.lrelu(self.conv_hr(feat)))
        return out

def load_realesrgan_model(weights_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = RRDBNet(num_in_ch=3, num_out_ch=3, scale=4, num_feat=64, num_block=23, num_grow_ch=32)
    state_dict = torch.load(weights_path, map_location=device)
    key = 'params_ema' if 'params_ema' in state_dict else 'params'
    model.load_state_dict(state_dict[key], strict=True)
    model.eval()
    model = model.to(device)
    return model, device

def upscale_image_tiled(model, device, pil_img, tile_size=400, tile_pad=20):
    img = np.array(pil_img.convert('RGB')).astype(np.float32) / 255.0
    # HWC to BCHW
    tensor = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0).to(device)
    
    b, c, h, w = tensor.shape
    scale = 4
    output_h = h * scale
    output_w = w * scale
    output = torch.zeros((b, c, output_h, output_w), dtype=torch.float32, device=device)
    
    tiles_x = int(np.ceil(w / tile_size))
    tiles_y = int(np.ceil(h / tile_size))
    
    print(f"Upscaling {w}x{h} -> {output_w}x{output_h} using {tiles_x}x{tiles_y} tiles...")
    
    with torch.no_grad():
        for y in range(tiles_y):
            for x in range(tiles_x):
                # Coordinates with padding
                x1 = x * tile_size
                x2 = min(x1 + tile_size, w)
                y1 = y * tile_size
                y2 = min(y1 + tile_size, h)
                
                pad_x1 = max(x1 - tile_pad, 0)
                pad_x2 = min(x2 + tile_pad, w)
                pad_y1 = max(y1 - tile_pad, 0)
                pad_y2 = min(y2 + tile_pad, h)
                
                tile_in = tensor[:, :, pad_y1:pad_y2, pad_x1:pad_x2]
                tile_out = model(tile_in)
                
                # Crop padding from output
                crop_y1 = (y1 - pad_y1) * scale
                crop_y2 = crop_y1 + (y2 - y1) * scale
                crop_x1 = (x1 - pad_x1) * scale
                crop_x2 = crop_x1 + (x2 - x1) * scale
                
                tile_clean = tile_out[:, :, crop_y1:crop_y2, crop_x1:crop_x2]
                output[:, :, y1*scale:y2*scale, x1*scale:x2*scale] = tile_clean
                
    output = output.squeeze(0).permute(1, 2, 0).cpu().clamp(0, 1).numpy()
    output = (output * 255.0).round().astype(np.uint8)
    return Image.fromarray(output)

if __name__ == '__main__':
    weights = 'scripts/RealESRGAN_x4plus.pth'
    input_path = r'C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\hero_desktop_ultra_hd_1792516574265.jpg'
    
    print("Loading model...")
    model, device = load_realesrgan_model(weights)
    print(f"Model loaded on {device}!")
    
    im = Image.open(input_path)
    print(f"Input image: {im.size}")
    
    upscaled = upscale_image_tiled(model, device, im, tile_size=384, tile_pad=16)
    out_master = r'familyfit-frontend/public/images/hero-master-3200.png'
    
    # Resize master to 3200 x 1788 (16:9) with ultra high detail
    target_w = 3200
    target_h = int(target_w * (im.height / im.width))
    master_3200 = upscaled.resize((target_w, target_h), Image.Resampling.LANCZOS)
    master_3200.save(out_master, 'PNG')
    print(f"Saved master high-res hero image: {master_3200.size} at {out_master}")
