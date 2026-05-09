function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

async function addMovie() {

    const movie_name = document.getElementById("movieName").value;
    const genre = document.getElementById("genre").value;
    const duration = document.getElementById("duration").value;
    const language = document.getElementById("language").value;
    const show_time = document.getElementById("timing").value;
    const theatre_name = document.getElementById("theatre").value;
    const poster_url = document.getElementById("poster").value;
    const show_date = document.getElementById("showDate").value;

    const response = await fetch("https://poornima-talkies-backend.onrender.com/add-movie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            movie_name,
            genre,
            duration,
            language,
            show_time,
            theatre_name,
            poster_url,
            show_date
        })
    });

    const data = await response.json();

    if (data.success) {
        alert("Movie Added Successfully");

        loadMovies();

        document.getElementById("movieName").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("duration").value = "";
        document.getElementById("language").value = "";
        document.getElementById("timing").value = "";
        document.getElementById("theatre").value = "";
        document.getElementById("poster").value = "";
        document.getElementById("showDate").value = "";
    }
}

async function loadMovies() {

    const response = await fetch("https://poornima-talkies-backend.onrender.com/movies");
    const movies = await response.json();

    const movieList = document.getElementById("movieList");

    movieList.innerHTML = "";

    movies.forEach(movie => {

        movieList.innerHTML += `
            <div class="movie-card">

                <img src="${movie.poster_url}" alt="Poster">

                <h3>${movie.movie_name}</h3>

                <p>${movie.genre}</p>

                <p>${movie.show_time}</p>

                <p>📅 ${formatDate(movie.show_date)}</p>

                <button onclick="deleteMovie(${movie.id})">
                    Delete Movie
                </button>

            </div>
        `;
    });
}

async function deleteMovie(id) {

    await fetch(`https://poornima-talkies-backend.onrender.com/delete-movie/${id}`, {
        method: "DELETE"
    });

    loadMovies();
}

async function loadBookings() {

    const response = await fetch("https://poornima-talkies-backend.onrender.com/bookings");

    const bookings = await response.json();

    const bookingList = document.getElementById("bookingList");

    bookingList.innerHTML = "";

    if (bookings.length === 0) {
        bookingList.innerHTML = "<p>No seats booked yet</p>";
        return;
    }

    bookings.forEach(booking => {

        bookingList.innerHTML += `
            <div class="movie-card">

                <h3>${booking.movie_name}</h3>

                <p>📅 ${formatDate(booking.show_date)}</p>

                <p>🕒 ${booking.show_time}</p>

                <p>💺 ${booking.seat_number}</p>

                <p>📱 ${booking.user_phone}</p>

                <button onclick="deleteBooking(${booking.id})">
                    Free Seat
                </button>

            </div>
        `;
    });
}

async function deleteBooking(id) {

    await fetch(`https://poornima-talkies-backend.onrender.com/delete-booking/${id}`, {
        method: "DELETE"
    });

    loadBookings();
}

loadMovies();
loadBookings();