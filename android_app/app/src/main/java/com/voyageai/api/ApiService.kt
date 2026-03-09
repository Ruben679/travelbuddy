package com.voyageai.api

import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Body
import retrofit2.http.Path

data class Flight(
    val id: Int,
    val airline: String,
    val from: String,
    val to: String,
    val departure: String,
    val arrival: String,
    val price: Double,
    val type: String
)

data class BookingRequest(
    val userId: Int,
    val itemType: String,
    val itemId: Int,
    val passengers: List<Passenger>,
    val seatNumber: String,
    val mealPreference: String,
    val totalPrice: Double
)

data class Passenger(
    val name: String,
    val age: Int,
    val gender: String
)

data class BookingResponse(
    val success: Boolean,
    val bookingId: Int?,
    val message: String?
)

interface ApiService {
    @GET("api/flights")
    suspend fun getFlights(): List<Flight>

    @GET("api/trains")
    suspend fun getTrains(): List<Flight>

    @POST("api/bookings")
    suspend fun createBooking(@Body request: BookingRequest): BookingResponse

    @GET("api/bookings/{userId}")
    suspend fun getUserBookings(@Path("userId") userId: Int): List<Map<String, Any>>
}
