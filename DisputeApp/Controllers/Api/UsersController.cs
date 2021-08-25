using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DisputeApp.Controllers.Api
{
    public class UsersController : ApiController
    {
        private SqlConnection defaultConnect;
        private string defaultDatabase;
        public UsersController()
        {
            defaultDatabase = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            defaultConnect = new SqlConnection(defaultDatabase);
        }
        [HttpGet]
        public bool addUser(string userName)
        {
            try
            {
                defaultConnect.Open();
                string comm = String.Format("insert into users values ('{0}','123','1')",userName);
                SqlCommand sqlCmd = new SqlCommand(comm, defaultConnect);
                sqlCmd.ExecuteNonQuery();
                defaultConnect.Close();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
            
        }

        [HttpGet]
        public DataSet GetUsers()
        {
            defaultConnect.Open();
            SqlDataAdapter comm = new SqlDataAdapter(String.Format("select * from users"),defaultConnect);
            DataSet dt = new DataSet();
            comm.Fill(dt);
            defaultConnect.Close();
            return dt;
        }
    }
}
