<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    
    <!-- ************************************************************************************************** -->
    <!-- Body Copy -->
    <!-- ************************************************************************************************** -->

    <input type="hidden" id="uxPagePath" runat="server" value="ManageVideos.aspx" class="pageName" />

    <!-- ************************************************************************************************** -->
    <!-- Breadcrumb -->
    <!-- ************************************************************************************************** -->
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="active">Manage Videos</li>
    </ol>

    <div id="mainFormWrapper">
        <div class="form-group">
            <label for="AccountSelect" class="control-label">Select Account</label>
            <select id="ddlSelectAccount" class="form-control"
                data-bind="foreach: AccountListData, event: { change: AccountChange } ">
                <option data-bind="text: PropertyName, attr: { 'data-item-id': PropertyId }, value: $root.GetReadToken($data)"></option>
            </select>
        </div>

        <div class="form-group search">
            <label for="searchBox">Search</label>
            <div class="form-group" style="margin-bottom: 0">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search"
                        name="srch-term" id="searchBox">
                    <div class="input-group-btn searchButton">
                        <button class="btn btn-default" type="button" id="searchButton"
                            data-bind="click: SearchBtnClick">
                            <i class="glyphicon glyphicon-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <br />

            <label class="radio-inline searchScope">
                <input type="radio" name="searchScope"
                    id="SharePoint" value="SharePoint" checked="checked"
                    data-bind="click: SearchScopeClick">SharePoint only</input>
            </label>
            <label class="radio-inline searchScope">
                <input type="radio" name="searchScope"
                    id="VideoCloud" value="VideoCloud"
                    data-bind="click: SearchScopeClick">Video Cloud only</input>
            </label>

        </div>

        <hr />

        <div>
            <div class="col-md-3">
                <span>Sort results by: </span>
            </div>
            <div class="col-md-9 searchResultsOrderByField">
                <label class="radio-inline">
                    <input type="radio" name="searchResultsOrderByField"
                        id="displayName" value="displayName" checked="checked"
                        data-bind="event: { click: SortByFieldClick }">display name</input>
                </label>
                <label class="radio-inline">
                    <input type="radio" name="searchResultsOrderByField"
                        id="relevance" value="relevance"
                        data-bind="event: { click: SortByFieldClick }">relevance</input>
                </label>
                <label class="radio-inline">
                    <input type="radio" name="searchResultsOrderByField"
                        id="creationDate" value="creationDate"
                        data-bind="event: { click: SortByFieldClick }">creation date</input>
                </label>
                <label class="radio-inline">
                    <input type="radio" name="searchResultsOrderByField"
                        id="startDate" value="startDate"
                        data-bind="event: { click: SortByFieldClick }">start date</input>
                </label>
            </div>
        </div>
        <div>
            <div class="col-md-3">
                <span>Order: </span>
            </div>
            <div class="col-md-9 searchSortOrder">
                <label class="radio-inline">
                    <input type="radio" name="searchSortOrder"
                        id="ascending" value="ascending" checked="checked"
                        data-bind="event: { click: SortByFieldClick }">ascending</input>
                </label>
                <label class="radio-inline">
                    <input type="radio" name="searchSortOrder"
                        id="descending" value="descending"
                        data-bind="event: { click: SortByFieldClick }">descending</input>
                </label>
            </div>
        </div>

        <br clear="all" />
        <hr />
        <div class="col-md-12 results PaginatedResults"
                style="display: none">
        </div>
        <div class="col-md-12 results AllSharepointResults"
            id="AllSharepointResults" 
            style="display:none"
            data-bind="visible: VideoListData">

            <ul class="resultItems"
                data-bind="foreach: VideoListData">
                <li data-bind="attr: { 'data-order': $index, 'data-name': VideoTitle(), 'data-created': VideoStartDate(), 'data-started': VideoEndDate(), 'data-account': Account() }">
                    <img class="resultImage" data-bind="attr: { 'src': VideoThumbNail(), 'alt': VideoThumbNail() }" />
                    <div class="row">
                        <a class="title" data-bind="text: VideoTitle, attr: { 'href': $root.FormatURL(SPID(), VideoID()) }">Video Title - XYZ</a>
                        <p data-bind="text: VideoShortDescription">Short Descriptive Text</p>

                        <p class="tags" data-bind="foreach: $root.GetTagsArray(Keywords())">
                            <button type="button" class="btn btn-primary btn-xs"
                                onclick="javascript:void(0)"
                                data-bind="text: $data">
                                Tag 1</button>
                        </p>
                    </div>
                    <div class="row">
                        <a class="editPage" data-bind="attr: { 'href': $root.FormatURL(SPID(), VideoID()) }">Edit Video</a>
                        <p class="BCVideoID">
                            <span>Video ID: </span>
                            <span data-bind="text: ReferenceID">CCXX12243</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="col-md-12 results CloudResults"
            id="CloudResults"
            data-bind="visible: CloudListData" style="display: none">
            <ul class="resultItems"
                data-bind="foreach: CloudListData">
                <li data-bind="attr: { 'data-order': $index, 'data-name': VideoTitle(), 'data-created': VideoStartDate(), 'data-started': VideoEndDate() }">
                    <img class="resultImage" data-bind="attr: { 'src': VideoThumbNail(), 'alt': VideoThumbNail() }" />
                    <div class="row">
                        <a class="title"
                                data-bind="text: VideoTitle, attr: { 'href': $root.FormatURLForCloud(VideoID()) }">Video Title - XYZ</a>
                        <p data-bind="text: VideoShortDescription">Short Descriptive Text</p>

                        <p class="tags" data-bind="foreach: $root.GetTagsArray(Keywords())">
                            <button type="button" class="btn btn-primary btn-xs"
                                onclick="javascript:void(0)"
                                data-bind="text: $data">
                                Tag 1</button>
                        </p>
                    </div>
                    <div class="row">
                        <a class="editPage" 
                            data-bind="attr: { 'href': $root.FormatURLForCloud(VideoID()) }">Edit Video</a>
                                    
                    </div>
                </li>
            </ul>
        </div>
        <!-- ************************************************************************************************** -->
        <!-- End Body Copy -->
        <!-- ************************************************************************************************** -->
               
</asp:Content>
