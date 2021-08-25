using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DisputeApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult Analysis()
        {
            return View();
        }

        public ActionResult Monitor()
        {
            return View();
        }
        public ActionResult CheckLogin(string userName, string userPassword)
        {
            string DatabaseName = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            SqlConnection conn = new SqlConnection(DatabaseName);
            conn.Open();
            SqlDataAdapter comm = new SqlDataAdapter(String.Format("select * from users where name = '{0}' and password = '{1}' ", userName, userPassword), conn);
            DataTable dt = new DataTable();
            comm.Fill(dt);
            conn.Close();
            if (dt.Rows.Count > 0)
            {
                Session["name"] = userName;
                Session["password"] = userPassword;
                Session["accessLevel"] = dt.Rows[0]["accessLevel"].ToString();
                return RedirectToAction("Admin");

            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        public ActionResult Logout()
        {
            Session["name"] = null;
            Session["password"] = null;
            Session["accessLevel"] = null;
            return RedirectToAction("Login");
        }

    }
}