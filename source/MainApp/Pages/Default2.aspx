<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <%--<SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />--%>
    <%--<SharePoint:ScriptLink name="SP.RequestExecutor.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />--%>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full" />
    <div>
        <p id="message">
            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
            initializing...
        </p>
        <p id="message2">
            ************************initializing...
        </p>
    </div>
    <h1>Script is here!!!</h1>
    <h3 id="message"></h3>
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.js"></script>
    <%--<script type="text/javascript" src="/_layouts/15/SP.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.RequestExecutor.js"></script>--%>
    <%--<SharePoint:ScriptLink Name="MicrosoftAjax.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />--%>
    <%--<SharePoint:ScriptLink Name="SP.core.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="SP.RequestExecutor.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />--%>
    <%--<SharePoint:ScriptLink runat="server" Name="SP.js" Localizable="false" OnDemand="False" LoadAfterUI="True"></SharePoint:ScriptLink>--%>
    <%--<script src="../Scripts/App.js"></script>--%>
    <script type="text/javascript">
        var web;
        var hostweburl;
        var appweburl;

        $(document).ready(function () {
            alert('test');

            sharePointReady();
            //var items1 = retrieveListItems('https://awemind.sharepoint.com/Lists/App%2012/');
            //var items2 = retrieveListItems('https://awemind.sharepoint.com/Lists/App%2012/AllItems.aspx');

            //var items = retrieveListItems('/_layouts/15/', 'Events');

            //// Get the ClientContext for the app web
            //var clientContext = new SP.ClientContext.get_current();
            //// Use the host web URL to get a parent context - this allows us to get data from the parent
            //var hostweburl = '/_layouts/15/';//decodeURIComponent(getQueryStringParameter("SPHostUrl"));
            //var parentCtx = new SP.AppContextSite(clientContext, hostweburl);
            //var parentWeb = parentCtx.get_web();
            //var parentList = parentWeb.get_lists().getByTitle("Events");

        });

        function retrieveListItems(siteUrl, listName) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, siteUrl);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(listName);
            //var clientContext = new SP.ClientContext(siteUrl);
            //var oList = clientContext.get_web().get_lists().getByTitle('App 12');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
                '<RowLimit>10</RowLimit></View>'
            );
            this.collListItem = oList.getItems(camlQuery);

            cContext.load(collListItem);
            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onQuerySucceeded),
                Function.createDelegate(this, this.onQueryFailed)
            );
        }

        function onQuerySucceeded(sender, args) {
            var listItemInfo = '';
            var listItemEnumerator = collListItem.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                listItemInfo += '<li>' + '\nTitle: ' + oListItem.get_item('Title') + '</li>';
            }

            //alert(listItemInfo.toString());
            document.getElementById("message2").innerHTML = '<h3>Lists items found:</h3><ul>' + listItemInfo.toString() + '</ul>';
        }

        function onQueryFailed(sender, args) {
            alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        }

        function sharePointReady() {
            hostweburl =
                 decodeURIComponent(
                     getQueryStringParameter('SPHostUrl')
             );
            appweburl =
                decodeURIComponent(
                    getQueryStringParameter('SPAppWebUrl')
             );

            var scriptbase = hostweburl + '/_layouts/15/';
                    //$.getScript(scriptbase + 'SP.js',
                    //    function () { $.getScript(scriptbase + 'SP.RequestExecutor.js', printAllListNamesFromHostWeb); }
                    //);
            
            $.getScript(scriptbase + 'SP.Runtime.js',
                function () {
                    $.getScript(scriptbase + 'SP.js',
                        function () { $.getScript(scriptbase + 'SP.RequestExecutor.js', RunPageLoad); }
                    );
                }
            );
        }
        function RunPageLoad()
        {
            printAllListNamesFromHostWeb();
            var items = retrieveListItems('https://awemind.sharepoint.com/_layouts/15/', 'Accounts');
            SetFullScreenMode(true); PreventDefaultNavigation();
        }
        function getQueryStringParameter(param) {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == param) {
                    return singleParam[1];
                }
            }
        }

        function printAllListNamesFromHostWeb() {
            var context;
            var factory;
            var appContextSite;
            var collList;

            context = new SP.ClientContext(appweburl);
            factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
            context.set_webRequestExecutorFactory(factory);
            appContextSite = new SP.AppContextSite(context, hostweburl);

            this.web = appContextSite.get_web();
            collList = this.web.get_lists();
            context.load(collList);

            context.executeQueryAsync(
                Function.createDelegate(this, successHandler),
                Function.createDelegate(this, errorHandler)
            );

            function successHandler() {
                var listInfo = '';
                var listEnumerator = collList.getEnumerator();

                while (listEnumerator.moveNext()) {
                    var oList = listEnumerator.get_current();
                    listInfo += '<li>' + oList.get_title() + '</li>';
                }

                document.getElementById("message").innerHTML = 'Lists found:<ul>' + listInfo + '</ul>';
            }

            function errorHandler(sender, args) {
                document.getElementById("message").innerText =
                    "Could not complete cross-domain call: " + args.get_message();
            }
        }
    </script>
</asp:Content>
