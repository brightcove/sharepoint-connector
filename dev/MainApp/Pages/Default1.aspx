<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <%--<div>
        <p id="message">
            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
            initializing...
        </p>
    </div>

    <a href="page1.aspx">default2.aspx</a>--%>
    <hr />

    <link href="../Content/bootstrap.min.css" rel="stylesheet" />
    <link href="../Content/Site.css" rel="stylesheet" />
    <link href="../favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <script type="text/javascript" src="../Scripts/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="../Scripts/modernizr-2.6.2.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/respond.min.js"></script>
    <script type="text/javascript" src="../Scripts/knockout-3.2.0.js"></script>
    <script type="text/javascript" src="../Scripts/knockout.mapping.js"></script>
    <script type="text/javascript" src="../Scripts/Site.js"></script>
    <script type="text/javascript" src="../Scripts/install.js"></script>
    
    <div class="navbar navbar-inverse navbar-fixed-top" style="display: none;margin-top:30px;">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" runat="server" href="~/">Application name</a>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li><a runat="server" href="Page1.aspx" data-id="Page1.aspx">Development Page</a></li>
                        <li><a runat="server" href="Default.aspx" data-id="default.aspx">Home</a></li>
                        <li><a runat="server" href="AccountManagement.aspx" data-id="AccountManagement.aspx">Account Management</a></li>
                        <li><a runat="server" href="AddVideos.aspx" data-id="AddVideos.aspx">Add Videos</a></li>
                        <li><a runat="server" href="ManageVideos.aspx" data-id="ManageVideos.aspx">Manage Videos</a></li>
                        <li><a runat="server" href="ManagePlaylists.aspx" data-id="ManagePlaylists.aspx">Manage Playlists</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="container body-content">


            <div class="row">
                <div class="col-md-4">
                    <nav class="leftNav">
                        <button type="button" class="btn btn-primary btn-lg btn-block"><a runat="server" href="~/" data-id="default.aspx">Home</a></button>
                        <button type="button" class="btn btn-default btn-lg btn-block"><a runat="server" href="AccountManagement.aspx" data-id="AccountManagement.aspx">Account Management</a></button>
                        <button type="button" class="btn btn-default btn-lg btn-block"><a runat="server" href="AddVideos.aspx" data-id="AddVideos.aspx">Add Videos</a></button>
                        <button type="button" class="btn btn-default btn-lg btn-block"><a runat="server" href="ManageVideos.aspx" data-id="ManageVideos.aspx">Manage Videos</a></button>
                        <button type="button" class="btn btn-default btn-lg btn-block"><a runat="server" href="ManagePlaylists.aspx" data-id="ManagePlaylists.aspx">Manage Playlists</a></button>
                    </nav>

                    <!-- ************************************************************************************************** -->
                    <p></p>
                    <hr />
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                        <span class="glyphicon glyphicon-play"></span>Getting Started
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseOne" class="panel-collapse collapse in">
                                <div class="panel-body">
                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson
                            <p>
                                <a class="btn btn-default" href="http://go.microsoft.com/fwlink/?LinkId=301948">Learn more &raquo;</a>
                            </p>
                                </div>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                                        <span class="glyphicon glyphicon-globe"></span>Get Help
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseTwo" class="panel-collapse collapse">
                                <div class="panel-body">
                                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson
                            <p>
                                <a class="btn btn-default" href="http://go.microsoft.com/fwlink/?LinkId=301948">Learn more &raquo;</a>
                            </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ************************************************************************************************** -->
                </div>

                <div class="col-md-8">
                    <input type="hidden" id="uxPagePath" runat="server" value="default.aspx" class="pageName" />

                    <div class="jumbotron">
                        <h1>Brightcove Management Pages</h1>
                        <p class="lead">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                    Integer viverra tempus massa, et gravida enim. Aenean in justo bibendum quam eleifend 
                                    elementum. Vestibulum id faucibus ante. Nam viverra, tortor consequat iaculis vestibulum, 
                                    nisi urna tempus nulla, vel pulvinar nunc magna eu sem. Duis id condimentum ligula.
                        </p>
                        <p><a href="http://www.asp.net" class="btn btn-primary btn-lg">Learn more &raquo;</a></p>
                    </div>
                    <button class="btn btn-default btn-lg btn-block" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(accountList);return false" id="btnAccounts_Test" >Create Account List</button>    
                    <button class="btn btn-default btn-lg btn-block" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(videosList);return false" id="btnVideos_Test" >Create Videos List</button>    
                    <button class="btn btn-default btn-lg btn-block" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(videoImagesList);return false" id="btnVideoImages_Test" >Create Video Images List</button>        
                </div>
            </div>
            <hr />

            <footer>
                <p>&copy; 2014 - Brightcove Video Management</p>
            </footer>
</asp:Content>
