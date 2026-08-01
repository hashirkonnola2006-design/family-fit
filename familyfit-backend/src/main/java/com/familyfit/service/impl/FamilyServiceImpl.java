package com.familyfit.service.impl;

import com.familyfit.dto.FamilyDTO;
import com.familyfit.dto.FamilyMemberDTO;
import com.familyfit.entity.*;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FamilyServiceImpl {

    private final FamilyRepository familyRepository;
    private final FamilyMemberRepository memberRepository;
    private final EntityMapper mapper;

    public FamilyDTO getFamily(Long familyId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family", familyId));
        return mapper.toFamilyDTO(family);
    }

    public FamilyDTO updateFamilyName(Long familyId, String newName) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family", familyId));
        family.setName(newName);
        return mapper.toFamilyDTO(familyRepository.save(family));
    }

    public List<FamilyMemberDTO> getMembers(Long familyId) {
        return memberRepository.findByFamilyId(familyId)
                .stream().map(mapper::toMemberDTO).collect(Collectors.toList());
    }

    public FamilyMemberDTO addMember(Long familyId, FamilyMemberDTO dto) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family", familyId));

        FamilyMember member = buildMemberFromDTO(dto, family);
        return mapper.toMemberDTO(memberRepository.save(member));
    }

    public FamilyMemberDTO updateMember(Long memberId, FamilyMemberDTO dto) {
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        if (dto.getName() != null && !dto.getName().isBlank()) member.setName(dto.getName());
        if (dto.getAge() > 0) member.setAge(dto.getAge());
        if (dto.getHeightCm() > 0) member.setHeightCm(dto.getHeightCm());
        if (dto.getWeightKg() > 0) member.setWeightKg(dto.getWeightKg());
        if (dto.getGender() != null) {
            try { member.setGender(FamilyMember.Gender.valueOf(dto.getGender().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getActivityLevel() != null) {
            try { member.setActivityLevel(FamilyMember.ActivityLevel.valueOf(dto.getActivityLevel().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getAllergies() != null) member.setAllergies(dto.getAllergies());
        if (dto.getHealthConditions() != null) member.setHealthConditions(dto.getHealthConditions());
        if (dto.getIsPregnantOrBreastfeeding() != null) member.setIsPregnantOrBreastfeeding(dto.getIsPregnantOrBreastfeeding());
        if (dto.getHasChewingDifficulty() != null) member.setHasChewingDifficulty(dto.getHasChewingDifficulty());
        if (dto.getDietaryFlags() != null) member.setDietaryFlags(dto.getDietaryFlags());
        if (dto.getDietPreference() != null) {
            try { member.setDietPreference(FamilyMember.DietPreference.valueOf(dto.getDietPreference().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getFitnessGoal() != null) {
            try { member.setFitnessGoal(FamilyMember.FitnessGoal.valueOf(dto.getFitnessGoal().toUpperCase())); } catch (Exception ignored) {}
        }

        return mapper.toMemberDTO(memberRepository.save(member));
    }

    public void deleteMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResourceNotFoundException("FamilyMember", memberId);
        }
        memberRepository.deleteById(memberId);
    }

    // ─── Helper ──────────────────────────────────────────────────────────

    private FamilyMember buildMemberFromDTO(FamilyMemberDTO dto, Family family) {
        FamilyMember.Role role = (dto.getRole() != null) ? FamilyMember.Role.valueOf(dto.getRole().toUpperCase()) : FamilyMember.Role.PARENT;
        FamilyMember.Gender gender = parseEnum(FamilyMember.Gender.class, dto.getGender(), FamilyMember.Gender.OTHER);
        FamilyMember.ActivityLevel activity = parseEnum(FamilyMember.ActivityLevel.class, dto.getActivityLevel(), FamilyMember.ActivityLevel.MODERATELY_ACTIVE);
        FamilyMember.DietPreference diet = parseEnum(FamilyMember.DietPreference.class, dto.getDietPreference(), FamilyMember.DietPreference.NO_PREFERENCE);
        FamilyMember.FitnessGoal goal = parseEnum(FamilyMember.FitnessGoal.class, dto.getFitnessGoal(), FamilyMember.FitnessGoal.MAINTAIN_WEIGHT);

        if (role == FamilyMember.Role.PARENT) {
            return Parent.builder()
                    .name(dto.getName())
                    .age(dto.getAge())
                    .heightCm(dto.getHeightCm())
                    .weightKg(dto.getWeightKg())
                    .role(role)
                    .gender(gender)
                    .activityLevel(activity)
                    .allergies(dto.getAllergies() != null ? dto.getAllergies() : List.of())
                    .healthConditions(dto.getHealthConditions() != null ? dto.getHealthConditions() : List.of())
                    .isPregnantOrBreastfeeding(dto.getIsPregnantOrBreastfeeding())
                    .hasChewingDifficulty(dto.getHasChewingDifficulty())
                    .dietaryFlags(dto.getDietaryFlags() != null ? dto.getDietaryFlags() : List.of())
                    .dietPreference(diet)
                    .fitnessGoal(goal)
                    .family(family)
                    .build();
        } else {
            return Child.builder()
                    .name(dto.getName())
                    .age(dto.getAge())
                    .heightCm(dto.getHeightCm())
                    .weightKg(dto.getWeightKg())
                    .role(role)
                    .gender(gender)
                    .activityLevel(activity)
                    .allergies(dto.getAllergies() != null ? dto.getAllergies() : List.of())
                    .healthConditions(dto.getHealthConditions() != null ? dto.getHealthConditions() : List.of())
                    .isPregnantOrBreastfeeding(dto.getIsPregnantOrBreastfeeding())
                    .hasChewingDifficulty(dto.getHasChewingDifficulty())
                    .dietaryFlags(dto.getDietaryFlags() != null ? dto.getDietaryFlags() : List.of())
                    .dietPreference(diet)
                    .fitnessGoal(goal)
                    .family(family)
                    .build();
        }
    }

    private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String val, E defaultVal) {
        if (val == null || val.isBlank()) return defaultVal;
        try {
            return Enum.valueOf(enumClass, val.toUpperCase());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
