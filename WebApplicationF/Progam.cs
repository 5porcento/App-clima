using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o HttpClient ao container 
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigin",
        builder => { builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod(); });
});

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");

app.MapGet("/weather", async (IHttpClientFactory clientFactory, double lat = -0.1257, double lon =50.51085) =>
{
    string apiKey = "xxxxxxxxxxxxxxxxx-yyyyyyyy";
    string url = $"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric&lang=pt_br";

    var client = clientFactory.CreateClient();
    HttpResponseMessage response = await client.GetAsync(url);

    if (response.IsSuccessStatusCode)
    {
        var responseBody = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(responseBody);
        var root = jsonDoc.RootElement;

        var weatherData = new
        {
            Temperatura = root.GetProperty("main").GetProperty("temp").GetDouble(),
            Condição = root.GetProperty("weather")[0].GetProperty("description").GetString(),
            Pressão = root.GetProperty("main").GetProperty("pressure").GetInt32()
        };

        return Results.Ok(new
        {
            Temperatura = $"{weatherData.Temperatura}",
            Condição = weatherData.Condição,
            Pressão = $"{weatherData.Pressão} hPa"
        });
    }

    {
        return Results.Problem("Não foi possivel obter os dados meteorológicos.");
    }
});

app.Run();
