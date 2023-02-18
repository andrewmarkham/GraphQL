namespace Alloy.Admin;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
public class Program
{
    public static void Main(string[] args) => CreateHostBuilder(args).Build().Run();

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureCmsDefaults()
            .ConfigureAppConfiguration((context, config) =>
            {
                var settings = config.Build();

                if (!context.HostingEnvironment.IsDevelopment())
                {
                    var keyVaultEndpoint = settings["AzureKeyVaultEndpoint"];
                    var azureADManagedIdentityClientId = settings["AzureADManagedIdentityClientId"];

                    var uri = new Uri(settings[keyVaultEndpoint]);
                    config.AddAzureKeyVault(uri, new DefaultAzureCredential(new DefaultAzureCredentialOptions
                    {
                        ManagedIdentityClientId = azureADManagedIdentityClientId
                    }));
                }
            })
            .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
}
