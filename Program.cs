using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Microsoft.Extensions.Options;
using System.Net;
using Microsoft.AspNetCore;
using Newtonsoft.Json;
using System.Security.Cryptography;

namespace REST_API
{
    public class Program
    {
        public static void Main(string[] args)
        {

            Debug.WriteLine("Creating HostBuilder");
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel(serverOptions =>
                    {
                        /*
                        serverOptions.ListenAnyIP(80);

                        serverOptions.ListenAnyIP(443, listenOptions =>
                        {
                            string password = System.IO.File.ReadLines("C:/cert/hendro777.tk.txt").First().Trim();
                            listenOptions.UseHttps("C:/cert/hendro777.tk.pfx", password);
                        });
                        */

                        serverOptions.ListenAnyIP(80);

                        serverOptions.ListenAnyIP(443, listenOptions =>
                        {
                            string password = System.IO.File.ReadLines("C:/cert/hendro777.tk.txt").First().Trim();
                            listenOptions.UseHttps("C:/cert/employee.lind.pfx", password);
                        });

                    });
                    webBuilder.UseStartup<Startup>();
                });
    }
}
