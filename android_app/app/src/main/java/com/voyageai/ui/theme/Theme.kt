package com.voyageai.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFE4E3E0),
    secondary = Color(0xFF141414),
    tertiary = Color(0xFFF27D26),
    background = Color(0xFF050505),
    surface = Color(0xFF141414),
    onPrimary = Color(0xFF141414),
    onSecondary = Color(0xFFE4E3E0),
    onBackground = Color(0xFFE4E3E0),
    onSurface = Color(0xFFE4E3E0),
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF141414),
    secondary = Color(0xFFE4E3E0),
    tertiary = Color(0xFFF27D26),
    background = Color(0xFFE4E3E0),
    surface = Color(0xFFFFFFFF),
    onPrimary = Color(0xFFE4E3E0),
    onSecondary = Color(0xFF141414),
    onBackground = Color(0xFF141414),
    onSurface = Color(0xFF141414),
)

@Composable
fun VoyageTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
