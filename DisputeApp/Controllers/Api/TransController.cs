using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DisputeApp.Controllers
{
    public class TransController : ApiController
    {
        private string cbsm, defaultDatabase;
        private SqlConnection cbsmConnection, defaultConnect;

        public string strconn = "Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.200.163)(PORT=1521)))(CONNECT_DATA =(SERVICE_NAME=orcl)));user id=obai;password=obai123;";
        public OracleConnection Orclconn;

        private string[] msg = new string[2];
        
        public TransController()
        {
            defaultDatabase = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            defaultConnect = new SqlConnection(defaultDatabase);

            cbsm = ConfigurationManager.ConnectionStrings["iMAL_CBSM"].ConnectionString;
            cbsmConnection = new SqlConnection(cbsm);
        }

        [HttpGet]
        public string[] AddTrans(string RRN, int transType,string branchCode,string employee)
        {
            switch (transType)
            {
                case 1:
                    this.getRrnState(RRN,branchCode,employee);
                    break;
                case 2:
                    this.ElectronicCollection(RRN,branchCode, employee);
                    break;
                default:                    
                    break;
            }
            return msg;
        }

        public string[] getRrnState(string rrn,string branchCode,string employee)
        {
            try
            {
                cbsmConnection.Open();
                SqlDataAdapter query = new SqlDataAdapter(String.Format("select InF1 as customer_account ,InF3 as branch,InF8 as currency,InF9 as amount,TransStatus_Code from TransactionsHFields where TransConsumer_RRN = '{0}' ", rrn), cbsmConnection);
                cbsmConnection.Close();
                DataTable store = new DataTable();
                query.Fill(store);
                if (store.Rows.Count > 0)
                {
                    for (int i = 0; i < store.Rows.Count; i++)
                    {
                        if (store.Rows[i]["TransStatus_Code"].ToString().Equals("5"))
                        {
                            msg[0] = "reversed";
                            msg[1] = "تم عكس المنازعة مسبقا";
                            break;
                        }
                        else if (store.Rows[i]["TransStatus_Code"].ToString().Equals("1") || store.Rows[i]["TransStatus_Code"].ToString().Equals("2") || store.Rows[i]["TransStatus_Code"].ToString().Equals("3"))
                        {
                            string customer_account = store.Rows[0]["customer_account"].ToString();
                            customer_account = customer_account.Substring(13, customer_account.Length - 13);
                            //string Account = CBSMdt.Rows[0]["InF1"].ToString();
                            string BRANCH_CODE = branchCode;
                            string PAY_CURR = store.Rows[0]["currency"].ToString();
                            PAY_CURR = PAY_CURR.Substring(13, 3);
                            string PAY_AMT = store.Rows[0]["amount"].ToString();
                            PAY_AMT = PAY_AMT.Substring(7,PAY_AMT.Length-7);
                            try
                            {
                                defaultConnect.Open();
                                string comm = String.Format("insert into VisualTrans (rrn,user_name,branch,send_date,state,PAY_AMT,PAY_CURR,feedback,employee) values('{0}','{1}','{2}',getdate(),'W','{3}','{4}','-','{5}') ", rrn, customer_account, BRANCH_CODE, PAY_AMT, PAY_CURR,employee);
                                SqlCommand sqlCmd = new SqlCommand(comm, defaultConnect);
                                sqlCmd.ExecuteNonQuery();
                                defaultConnect.Close();
                                msg[0] = "success";
                                msg[1] = "تم حفظ منازعة فوري";
                            }
                            catch (Exception e)
                            {
                                msg[0] = "faild";
                                msg[1] = "تم ارسال هذه المنازعة مسبقا";
                            }

                        }
                        else
                        {
                            msg[0] = "faild";
                            msg[1] = "حالة المنازعة " + store.Rows[i]["TransStatus_Code"].ToString();
                        }
                    }
                }
                else
                {
                    msg[0] = "faild";
                    msg[1] = "هذه المنازعة غير موجودة في فوري";
                }
                return msg;
            }
            catch (Exception e)
            {
                msg[0] = "faild";
                msg[1] = "غير قادر على الاتصال بسيرفر منازعات فوري";
                return msg;
            }
            
        }

        public string[] ElectronicCollection(string rrn,string branchCode,string employee)
        {
            try
            {
                
                Orclconn = new OracleConnection();
                Orclconn.ConnectionString = strconn;
                Orclconn.Open();
                OracleDataAdapter q = new OracleDataAdapter(String.Format("SELECT VOUCH_NO,BRANCH_CODE,PAY_AMT,PAY_CURR,USER_NAME from recard.pay_trans where VOUCH_NO = '{0}' ", rrn), Orclconn);
                DataTable dt = new DataTable();
                q.Fill(dt);
                Orclconn.Close();
                if (dt.Rows.Count > 0)
                {

                    string USER_NAME = dt.Rows[0]["USER_NAME"].ToString();
                    string BRANCH_CODE = branchCode;
                    string PAY_AMT = dt.Rows[0]["PAY_AMT"].ToString();
                    string PAY_CURR = dt.Rows[0]["PAY_CURR"].ToString();
                    defaultConnect.Open();
                    SqlDataAdapter Query = new SqlDataAdapter(String.Format("select * from VisualTrans where rrn = '{0}' ", rrn), defaultConnect);
                    DataTable tmpDataTable = new DataTable();
                    Query.Fill(tmpDataTable);
                    if (tmpDataTable.Rows.Count > 0)
                    {
                        msg[0] = "faild";
                        msg[1] = "تمت اضافة منازعة التحصيل مسبقا";
                    }
                    else
                    {
                        string comm = String.Format("insert into VisualTrans (rrn,user_name,branch,send_date,state,PAY_AMT,PAY_CURR,feedback,employee) values('{0}','{1}','{2}',getdate(),'W','{3}','{4}','-','{5}') ", rrn, USER_NAME, BRANCH_CODE, PAY_AMT, PAY_CURR,employee);
                        SqlCommand sqlCmd = new SqlCommand(comm, defaultConnect);
                        sqlCmd.ExecuteNonQuery();
                        msg[0] = "success";
                        msg[1] = "تمت اضافة منازعة التحصيل";
                    }

                    defaultConnect.Close();
                }
                else
                {
                    msg[0] = "faild";
                    msg[1] = "هذه المنازعة غير موجودة في التحصيل";
                }
            }
            catch (Exception e)
            {
                msg[0] = "faild";
                msg[1] = "غير قادر على الاتصال بقاعدة البيانات";
                
            }
            return msg;
        }


        public string GetIp()
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            return ip;
        }
    }
}
