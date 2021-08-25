using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DisputeApp.Controllers.Api
{
    public class ReplyController : ApiController
    {
        private SqlConnection defaultConnect;
        private string defaultDatabase;
        public ReplyController()
        {
            defaultDatabase = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            defaultConnect = new SqlConnection(defaultDatabase);
        }

        public string ShowTest()
        {
            return String.Format("I will be hacker");
        }
        [HttpGet]
        public bool AddComment(string R, string S, string C)
        {
            //return String.Format("rrn : {0} the state {1} comment {2}", R, S, C);
            
            try
            {
                defaultConnect.Open();
                string comm = String.Format("update visualTrans set state = '{0}'  where rrn like '%{1}%' ", S.ToString(), R.ToString());
                SqlCommand sqlCmd = new SqlCommand(comm, defaultConnect);
                sqlCmd.ExecuteNonQuery();
                defaultConnect.Close();
                return true;
            }catch(Exception e)
            {
                return false;
            }
            
            
        }
    }
}
