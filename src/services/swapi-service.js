export default class SwapiService {
  async getResourse(value, method, bodyPromise) {
    const res = await fetch(`${value}`, {
      method: method,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: bodyPromise,
    });

    if (!res.ok) {
      throw new Error(`Could not fetch `);
    }
    const body = await res.json();
    return body;
  }
  async getGenres(apiKey) {
    const res = await this.getResourse(
      `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`,
    );

    return res.genres;
  }
  async getGuestSession(apiKey) {
    const res = await this.getResourse(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`,
    );

    return res.guest_session_id;
  }
}
