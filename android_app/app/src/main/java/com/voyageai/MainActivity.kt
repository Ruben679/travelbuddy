package com.voyageai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.voyageai.ui.screens.*
import com.voyageai.ui.theme.VoyageTheme

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.voyageai.ui.screens.*
import com.voyageai.ui.theme.VoyageTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VoyageTheme {
                val navController = rememberNavController()
                val items = listOf(
                    Screen("home", "Home", Icons.Default.Home),
                    Screen("chat", "AI Chat", Icons.Default.Search),
                    Screen("my_bookings", "Bookings", Icons.Default.List)
                )

                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            val navBackStackEntry by navController.currentBackStackEntryAsState()
                            val currentDestination = navBackStackEntry?.destination
                            items.forEach { screen ->
                                NavigationBarItem(
                                    icon = { Icon(screen.icon, contentDescription = null) },
                                    label = { Text(screen.label) },
                                    selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                                    onClick = {
                                        navController.navigate(screen.route) {
                                            popUpTo(navController.graph.findStartDestination().id) {
                                                saveState = true
                                            }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("home") {
                            HomeScreen(onNavigateToBooking = { type, id ->
                                navController.navigate("booking/$type/$id")
                            })
                        }
                        composable("chat") {
                            ChatScreen()
                        }
                        composable("booking/{type}/{id}") { backStackEntry ->
                            val type = backStackEntry.arguments?.getString("type") ?: ""
                            val id = backStackEntry.arguments?.getString("id") ?: ""
                            BookingScreen(type, id, onBookingSuccess = {
                                navController.navigate("my_bookings")
                            })
                        }
                        composable("my_bookings") {
                            MyBookingsScreen()
                        }
                    }
                }
            }
        }
    }
}

data class Screen(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)
