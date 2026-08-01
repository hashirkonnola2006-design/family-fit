package com.familyfit.service;

/**
 * Marker interface for entities that support a favourite/heart toggle.
 * Implemented by {@link com.familyfit.entity.Recipe}.
 */
public interface Favoritable {
    boolean isFavorited();
    void toggleFavorite();
}
