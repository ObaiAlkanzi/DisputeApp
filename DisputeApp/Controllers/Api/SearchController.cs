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
    public class SearchController : ApiController
    {
        private SqlConnection defaultConnect;
        private string  defaultDatabase;
        public SearchController()
        {
            defaultDatabase = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            defaultConnect = new SqlConnection(defaultDatabase);
        }
        [HttpGet]
        public DataSet IntervalTransQuery(int id, string state)
        {
            defaultConnect.Open();
            SqlDataAdapter comm = new SqlDataAdapter(String.Format("select id,rrn,user_name,branch,RIGHT(convert(VARCHAR,send_date,10),11) as send_date,state,PAY_AMT,PAY_CURR,feedback,employee from Visualtrans where id > {0} and state = '{1}' order by id asc", id, state), defaultConnect);
            DataSet dt = new DataSet();
            comm.Fill(dt);
            defaultConnect.Close();
            return dt;
        }

        [HttpGet]
        public DataSet SearchTrans(string searchKey, string searchValue)
        {
            defaultConnect.Open();
            SqlDataAdapter comm = new SqlDataAdapter(String.Format("select id,rrn,user_name,branch,RIGHT(convert(VARCHAR,send_date,10),11) as send_date,state,PAY_AMT,PAY_CURR,feedback,employee from Visualtrans where {0} = '{1}' order by id asc", searchKey, searchValue), defaultConnect);
            DataSet dt = new DataSet();
            comm.Fill(dt);
            defaultConnect.Close();
            return dt;
        }

        [HttpGet]
        public DataSet SearchFilter(string processDate, string branch)
        {
            defaultConnect.Open();
            SqlDataAdapter comm = new SqlDataAdapter(String.Format("select id,rrn,user_name,branch,RIGHT(convert(VARCHAR,send_date,10),11) as send_date,state,PAY_AMT,PAY_CURR,feedback,employee from Visualtrans where send_date = '{0}' and branch = '{1}' order by id asc", processDate, branch), defaultConnect);
            DataSet dt = new DataSet();
            comm.Fill(dt);
            defaultConnect.Close();
            return dt;
        }
    }
}
