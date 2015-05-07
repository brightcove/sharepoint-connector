using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using Microsoft.SharePoint.WebPartPages;
using System.Web.UI.WebControls.WebParts;
using System.Web;
using System.Linq;

namespace BrightcoveVideoCloudIntegration.Layouts.BrightcoveVideoCloudIntegration
{
    public partial class Chooser : LayoutsPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Page.Response.Expires = 0;
            Page.Response.Cache.SetNoStore();
            Page.Response.AppendHeader("Pragma", "no-cache");

            if (!Page.IsPostBack)
            {
                string[] arrAccountsOrderInverse = Util.GetAccountsName();
                Array.Reverse(arrAccountsOrderInverse);
                ddlAccount.DataSource = arrAccountsOrderInverse;
                ddlAccount.DataBind();

                if (Request.QueryString["Account"] != null)
                {
                    ddlAccount.SelectedValue = Request.QueryString["Account"].ToString();
                }

                try
                {
                    string chooserWeb = HttpUtility.UrlDecode(Microsoft.SharePoint.SPContext.Current.Web.Url);


                    if (!string.IsNullOrEmpty(chooserWeb) && (chooserWeb != SPContext.Current.Web.Url))
                    {
                        string url = chooserWeb;

                        if (Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncChooserText] == "PlaylistId")
                        {
                            url += VideoPlayer.VideoPlayer.PlaylistChooser;
                        }
                        else
                        {
                            url += VideoPlayer.VideoPlayer.VideoChooser;
                        }


                        Response.Redirect(url);
                    }
                }
                catch { }
            }
            else
            {
                string chooserWeb = HttpUtility.UrlDecode(Microsoft.SharePoint.SPContext.Current.Web.Url);

                string url = chooserWeb;

                if (Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncChooserText] == "PlaylistId")
                {
                    url += VideoPlayer.VideoPlayer.PlaylistChooser;
                }
                else
                {
                    url += VideoPlayer.VideoPlayer.VideoChooser;
                }

                if (!string.IsNullOrEmpty(ddlAccount.SelectedValue) && ddlAccount.SelectedValue != "Select")
                {
                    url += "&Account=" + ddlAccount.SelectedValue;
                    Response.Redirect(url);
                }

            }

        }
    }
}
