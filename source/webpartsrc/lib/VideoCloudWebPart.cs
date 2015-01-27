using System;
using System.Collections;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls.WebParts;
using BrightcoveSDK;
using Microsoft.SharePoint;


namespace BrightcoveVideoCloudIntegration
{
    [ToolboxItemAttribute(false)]
    public class VideoCloudWebPart : Microsoft.SharePoint.WebPartPages.WebPart, IVideoCloudConfig
    {
        public const string QueryStringKeyAsyncQueryText = "async_query";
        public const string QueryStringKeyAsyncOrder = "async_query_order";
        public const string QueryStringKeyAsyncSort = "async_query_sort";
        public const string QueryStringKeyAsyncChooserText = "async_chooser";
        public const string KeyPublisherId = "Brightcove_PublisherId";
        public const string KeyReadToken = "Brightcove_ReadToken";
        public const string KeyWriteToken = "Brightcove_WriteToken";
        public const string KeyReadUrl = "Brightcove_ReadUrl";
        public const string KeyWriteUrl = "Brightcove_WriteUrl";
        public const string KeyVideoPlayerId = "Brightcove_DefaultVideoPlayerId";
        public const string KeyPlaylistPlayerId = "Brightcove_DefaultPlaylistPlayerId";
        
      


        private string _publisherId;              // Publisher ID
        private string _readToken;                // Read Token(s) - comma separated
        private string _writeToken;               // Write Token(s) - comma separated
        private string _readUrl;                  // Read URL
        private string _writeUrl;                 // Write URL
        private string _defaultVideoPlayerId;     // Default Video Player ID
        private string _defaultPlaylistPlayerId;  // Default Playlist Player ID

        public string PublisherId { get { return _publisherId; } set { _publisherId = value; } }
        public string ReadToken { get { return _readToken; } set { _readToken = value; } }
        public string WriteToken { get { return _writeToken; } set { _writeToken = value; } }
        public string ReadUrl { get { return _readUrl; } set { _readUrl = value; } }
        public string WriteUrl { get { return _writeUrl; } set { _writeUrl = value; } }
        public string DefaultVideoPlayerId { get { return _defaultVideoPlayerId; } set { _defaultVideoPlayerId = value; } }
        public string DefaultPlaylistPlayerId { get { return _defaultPlaylistPlayerId; } set { _defaultPlaylistPlayerId = value; } }
               

        /// <summary>
        /// Sharepoint list
        /// </summary>
        private string accountListAddress = "Lists/Account/AllItems.aspx";


        protected IVideoCloudConfig configProvider = null;

        private Hashtable _cachedConfigProvider = null;
        private string[] _videoListCache = null;
        private string[] _playlistCache = null;
        private bool _isAsyncCall = false;
        private bool _isDirty = false;

        protected override string GetCustomBuilder(string propertyName)
        {
            return base.GetCustomBuilder(propertyName);
        }


        private void GetOldConfiguration() {

            using (SPSite site = new SPSite(SPContext.Current.Web.Url))
            {
                SPWeb web = site.OpenWeb();

                if (_cachedConfigProvider == null)
                {
                    _cachedConfigProvider = new Hashtable();
                }

                if (_cachedConfigProvider.ContainsKey(web.Url) && !this._isDirty)
                {
                    this.configProvider = (IVideoCloudConfig)_cachedConfigProvider[web.Url];
                }
                else
                {
                    // Init Brightcove site settings
                    string[] keys = new string[] { KeyPublisherId, KeyReadToken, KeyWriteToken, KeyReadUrl, KeyWriteUrl, 
                        KeyVideoPlayerId, KeyPlaylistPlayerId };
                    bool madeChanges = false;

                    foreach (string key in keys)
                    {
                        if (!web.AllProperties.ContainsKey(key))
                        {
                            web.AllProperties.Add(key, string.Empty);
                            madeChanges = true;
                        }
                    }

                    if (web.AllProperties[KeyReadUrl].Equals(string.Empty))
                    {
                        web.AllProperties[KeyReadUrl] = "http://api.brightcove.com/services/library";
                        madeChanges = true;
                    }

                    if (web.AllProperties[KeyWriteUrl].Equals(string.Empty))
                    {
                        web.AllProperties[KeyWriteUrl] = "http://api.brightcove.com/services/post";
                        madeChanges = true;
                    }

                    // Get Brightcove settings
                    VideoConfig.VideoConfig bvcConfig = new VideoConfig.VideoConfig();

                    this.PublisherId = bvcConfig.PublisherId;
                    this.ReadToken = bvcConfig.ReadToken;
                    this.WriteToken = bvcConfig.WriteToken;
                    this.ReadUrl = bvcConfig.ReadUrl;
                    this.WriteUrl = bvcConfig.WriteUrl;
                    this.DefaultVideoPlayerId = bvcConfig.DefaultVideoPlayerId;
                    this.DefaultPlaylistPlayerId = bvcConfig.DefaultPlaylistPlayerId;
                    this.configProvider = this;

                    // Only write the config if the requested site matches the current site
                    if (_cachedConfigProvider.ContainsKey(web.Url))
                    {
                        _cachedConfigProvider[web.Url] = this.configProvider;
                    }
                    else
                    {
                        _cachedConfigProvider.Add(web.Url, this.configProvider);
                    }

                    if (madeChanges)
                    {
                        web.AllowUnsafeUpdates = true;
                        web.Update();
                    }
                }
            }
        }

        private Boolean belongstoGroup(SPWeb web, string group) {
            SPUser user = web.CurrentUser;
            foreach (SPGroup groups in user.Groups) {
                if (groups.Name.Equals(group.Trim(), StringComparison.InvariantCultureIgnoreCase)) {
                    return true;
                }
            }
            return false;
        }

        

        private void GetConfigurationfromList() {
            string accountSelected = "";
            if (Context.Request.QueryString["Account"] != null) {
                accountSelected = Context.Request.QueryString["Account"];
            }


            using (SPSite site = new SPSite(SPContext.Current.Web.Url))
            {
                SPWeb web = site.OpenWeb();                      
                SPList list = web.GetList(accountListAddress);                
                SPListItemCollection listItem = list.Items;
                
                SPSecurity.RunWithElevatedPrivileges(delegate()
            {
                foreach (SPListItem item in listItem)
                {
                    //if  user belongs to viewer or authors group load configuration
                    if (!string.IsNullOrEmpty(item["Account Name"].ToString()))
                    {
                        if (string.IsNullOrEmpty(accountSelected) || accountSelected == item["Account Name"].ToString())
                        {
                            
                            //if  user belongs to viewer or authors group load configuration
                            if (!string.IsNullOrEmpty(item["AccountViewersGroupName"].ToString()) && !string.IsNullOrEmpty(item["AccountAuthorsGroupName"].ToString()))
                            {
                                try
                                {
                                    // if (web.Groups[item["AccountViewersGroupName"].ToString()].ContainsCurrentUser)
                                    if (belongstoGroup(web, item["AccountViewersGroupName"].ToString()) || belongstoGroup(web, item["AccountAuthorsGroupName"].ToString()))
                                    {
                                        if (!string.IsNullOrEmpty(item["PublisherId"].ToString()))
                                        {
                                            this.PublisherId = item["PublisherId"].ToString();
                                        }

                                        if (!string.IsNullOrEmpty(item["DefaultVideoPlayerId"].ToString()))
                                        {
                                            this.DefaultVideoPlayerId = item["DefaultVideoPlayerId"].ToString();
                                        }

                                        if (!string.IsNullOrEmpty(item["DefaultPlaylistPlayerId"].ToString()))
                                        {
                                            this.DefaultPlaylistPlayerId = item["DefaultPlaylistPlayerId"].ToString();
                                        }

                                        if (!string.IsNullOrEmpty(item["ReadAPIServiceURL"].ToString()))
                                        {
                                            this._readUrl = item["ReadAPIServiceURL"].ToString();
                                        }

                                        if (!string.IsNullOrEmpty(item["WriteAPIServiceURL"].ToString()))
                                        {
                                            this._writeUrl = item["WriteAPIServiceURL"].ToString();
                                        }

                                        if (!string.IsNullOrEmpty(item["Tokens"].ToString()))
                                        {
                                            this.ReadToken = getReadToken(item["Tokens"].ToString(), "Read-");
                                            this.WriteToken = getReadToken(item["Tokens"].ToString(), "Write-");
                                        }
                                    }
                                    
                                    this.configProvider = this;
                                }
                                catch { }
                            } //End belongsgroup
                        }// end test acccount was selected on chooser.aspx
                    } // end test account name is not null
                } //End foreach
            });

         }
         
      }

        private string getReadToken(string value,string type) {
            string readToken = ""; 
            string[] tokens = value.Split(',');
            foreach (string token in tokens) 
            {
                if (token.StartsWith(type, StringComparison.InvariantCultureIgnoreCase))
                {
                    readToken = token.Substring(type.Length).Trim();
                }
            }
            return readToken;
        }

        protected override void CreateChildControls()
        {
            //Deprecated: GetOldConfiguration based on WebsiteProperties SP2010
            //GetOldConfiguration();            

            //Override Method to get configuration from Account List and based user group. SP2013
            GetConfigurationfromList();
            
            // Handle AJAX call to get a video list
            if (!this._isAsyncCall)
            {
                this._isAsyncCall = AsyncVideoList();

                //if (!this._isAsyncCall)
                //{
                //    this._isAsyncCall = AsyncChooser();
                //}
            }

            this.ChromeType = PartChromeType.None;
        }

        // For AJAX calls to get video list across web parts
        public bool AsyncVideoList()
        {
            string query = Page.Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncQueryText];
            string order = Page.Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncOrder];
            string sort = Page.Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncSort];
            if (query != null)
            {
                VideoCloudWebPartUserControl videoCloud = new VideoCloudWebPartUserControl();
                BCAPI api = videoCloud.CreateAPI(this.configProvider);                                              

                if (api != null)
                {
                    string chooser = Page.Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncChooserText];
                    string[] result = null;
                    int pageNumber = 0;

                    if (!string.IsNullOrEmpty(Page.Request.QueryString[Util.PagingKey]))
                    {
                        pageNumber = int.Parse(Page.Request.QueryString[Util.PagingKey]);
                    }

                    query = query.Trim();

                    if (string.IsNullOrEmpty(chooser))
                    {
                        result = Util.GetAllVideos(api, pageNumber, query,order,sort);
                    }
                    else
                    {
                        chooser = chooser.Trim();

                        if (chooser == "PlaylistId")
                        {
                            // Playlists
                            if (this._playlistCache == null)
                            {
                                result = Util.GetAllPlaylists(api, pageNumber, query, order, sort);
                                this._playlistCache = result;
                            }
                            else
                            {
                                result = this._playlistCache;
                            }
                        }
                        else
                        {
                            // Videos
                            if (this._videoListCache == null)
                            {
                                
                                result = Util.GetAllVideos(api, pageNumber, query,order,sort);
                                this._videoListCache = result;
                            }
                            else
                            {
                                result = this._videoListCache;
                            }
                        }
                    }

                    if (result == null)
                    {
                        result = new string[0];
                    }

                    string[] pagePath = Page.Request.FilePath.Split("/".ToCharArray());
                    string t = DateTime.Now.Ticks.ToString();
                    string pagingLink = pagePath[pagePath.Length - 1] + "?" + VideoCloudWebPart.QueryStringKeyAsyncQueryText + "=" + HttpUtility.UrlEncode(query) + "&t=" + t;

                    if (!string.IsNullOrEmpty(chooser))
                    {
                        pagingLink += "&" + VideoCloudWebPart.QueryStringKeyAsyncChooserText + "=" + HttpUtility.UrlEncode(chooser);
                    }

                    string resultJson = string.Format(
                         @"<script language=""javascript"" type=""text/javascript"" charset=""utf-8"">/*<![CDATA[*/
                            var vcAsyncVideoCount = {0};
                            var vcAsyncVideoResults = [{1}];
                            var vcAsyncVideoPaging = '{2}';
                        /*]]>*/</script>", result.Length, string.Join(",", result), Util.GetPaging(pageNumber, 50, result.Length, pagingLink));

                    // Clear the response and just display the results
                    Page.Response.Clear();
                    Page.Response.Write(resultJson);
                    Page.Response.Flush();
                    Page.Response.End();

                    return true;
                }
            }

            return false;
        }

        //public bool AsyncChooser()
        //{
        //    string property = Page.Request.QueryString[VideoCloudWebPart.QueryStringKeyAsyncChooserText];
        //    string result = string.Empty;

        //    if (string.IsNullOrEmpty(property))
        //    {
        //        return false;
        //    }

        //    result = "<html><head></head><body><div>Choose</div>" +
        //        "<script>var currVal = window.dialogArguments; window.returnValue = '1';</script>" + 
        //        "</body></html>";

        //    // Clear the response and just display the results
        //    Page.Response.Clear();
        //    Page.Response.Write(result);
        //    Page.Response.Flush();
        //    Page.Response.End();

        //    return true;
        //}
    }
}
