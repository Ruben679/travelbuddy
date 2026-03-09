package com.voyageai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.voyageai.api.Flight
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(onNavigateToBooking: (String, String) -> Unit) {
    var flights by remember { mutableStateOf<List<Flight>>(emptyList()) }
    val scope = rememberCoroutineScope()

    // In a real app, you'd use a ViewModel and Retrofit here
    // For now, this represents the UI structure
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Where to next?",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        Button(
            onClick = { /* Trigger Search */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Search Flights")
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn {
            items(flights) { flight ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    onClick = { onNavigateToBooking("flight", flight.id.toString()) }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("${flight.from} -> ${flight.to}", style = MaterialTheme.typography.titleMedium)
                        Text(flight.airline, style = MaterialTheme.typography.bodySmall)
                        Text("$${flight.price}", color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}
