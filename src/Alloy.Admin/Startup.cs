using Alloy.Admin.Extensions;
using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.DependencyInjection;
using EPiServer.Scheduler;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using EPiServer.Azure;
using Microsoft.Extensions.DependencyInjection;
using RestSharp;

namespace Alloy.Admin;

public class Startup
{
    private readonly IWebHostEnvironment _webHostingEnvironment;
    private readonly IConfiguration configuration;

    private readonly RestClient client;

    public Startup(IWebHostEnvironment webHostingEnvironment, IConfiguration configuration)
    {
        _webHostingEnvironment = webHostingEnvironment;
        this.configuration = configuration;

        client = new RestClient("https://graph-ql-three.vercel.app/");
    }

    public void ConfigureServices(IServiceCollection services)
    {
        if (_webHostingEnvironment.IsDevelopment())
        {
            AppDomain.CurrentDomain.SetData("DataDirectory", Path.Combine(_webHostingEnvironment.ContentRootPath, "App_Data"));

            services.Configure<SchedulerOptions>(options => options.Enabled = false);
        }

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddAlloy()
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Startup>();

        // Required by Wangkanai.Detection
        services.AddDetection();

        services.ConfigureContentApiOptions(o =>
        {
            o.IncludeInternalContentRoots = true;
            o.IncludeSiteHosts = true;
            o.EnablePreviewFeatures = true;
            o.SetValidateTemplateForContentUrl(true);
        });
        services.AddContentDeliveryApi(); // required, for further configurations, please visit: https://docs.developers.optimizely.com/content-cloud/v1.5.0-content-delivery-api/docs/configuration


        services.AddContentGraph(configuration);


        var blobConnectionString = this.configuration.GetConnectionString("BlobStorage");

        services.AddAzureBlobProvider(o =>
        {
            o.ConnectionString = blobConnectionString;
            o.ContainerName = "sitedata";
        });

        services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromSeconds(10);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IContentEvents contentEvents)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        // Required by Wangkanai.Detection
        app.UseDetection();
        app.UseSession();

        app.UseStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapContent();
        });

        contentEvents.PublishedContent += ContentEvents_PublishedContent;
    }

    private void ContentEvents_PublishedContent(object sender, ContentEventArgs e)
    {
        if (e.Content is IRoutable routableContent)
        {
            var url = UrlResolver.Current.GetUrl(e.ContentLink);

            Task.Run(() =>
            {
                var request = new RevalidateRequest { RevalidatePath = url };

                Task.Delay(10000);  // wait 10 seconds

                var r = client.PostJsonAsync<RevalidateRequest>("/api/revalidate/", request);

                Task.WaitAll(new[] { r });
            });

        }
    }

    private class RevalidateRequest
    {
        public string RevalidatePath { get; set; }
    }
}
