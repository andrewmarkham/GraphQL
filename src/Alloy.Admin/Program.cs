namespace Alloy.Admin;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
public class Program
{
    public static void Main(string[] args) => CreateHostBuilder(args).Build().Run();

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureCmsDefaults()
            /*
                .ConfigureAppConfiguration((context, config) =>
                {
                    var settings = config.Build();

                    if (!context.HostingEnvironment.IsDevelopment())
                    {
                        var keyVaultEndpoint = settings["AzureKeyVaultEndpoint"];
                        var azureADManagedIdentityClientId = settings["AzureADManagedIdentityClientId"];


                        var uri = new Uri(keyVaultEndpoint);
                        config.AddAzureKeyVault(uri, new DefaultAzureCredential());
                    }
                })
            */
            .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
}
