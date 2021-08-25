using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DisputeApp.Startup))]
namespace DisputeApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
