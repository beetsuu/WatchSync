using System.Text.Json;
using WatchSync.Api.DTOs;

namespace WatchSync.Api.Services;

public class TvMazeService
{
    private readonly HttpClient _client;

    public TvMazeService(HttpClient client)
    {
        _client = client;
    }


    public async Task<List<ShowSearchResultDto>> Search(string query)
    {
        var response = await _client.GetAsync(
            $"https://api.tvmaze.com/search/shows?q={query}"
        );

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();

        var results = JsonSerializer.Deserialize<List<SearchResult>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


        return results?
            .Select(x => new ShowSearchResultDto
            {
                ExternalId = x.Show.Id,
                Title = x.Show.Name,
                CoverUrl = x.Show.Image?.Original
                           ?? x.Show.Image?.Medium
            })
            .ToList()
            ?? new();
    }



    public async Task<ShowDetailsDto?> GetDetails(int id)
    {
        var showResponse = await _client.GetAsync(
            $"https://api.tvmaze.com/shows/{id}"
        );

        if (!showResponse.IsSuccessStatusCode)
            return null;


        var showJson = await showResponse.Content.ReadAsStringAsync();


        var show = JsonSerializer.Deserialize<TvShow>(
            showJson,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


        var episodesResponse = await _client.GetAsync(
            $"https://api.tvmaze.com/shows/{id}/episodes"
        );


        var episodesJson =
            await episodesResponse.Content.ReadAsStringAsync();


        var episodes =
            JsonSerializer.Deserialize<List<object>>(episodesJson);


        return new ShowDetailsDto
        {
            Title = show!.Name,
            CoverUrl = show.Image?.Original
                       ?? show.Image?.Medium,
            TotalEpisodes = episodes?.Count ?? 0
        };
    }



    private class SearchResult
    {
        public TvShow Show { get; set; } = new();
    }


    private class TvShow
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public TvImage? Image { get; set; }
    }


    private class TvImage
    {
        public string? Medium { get; set; }

        public string? Original { get; set; }
    }
}