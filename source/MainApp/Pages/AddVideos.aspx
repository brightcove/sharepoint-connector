<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <WebPartPages:AllowFraming runat="server" />

    <link href="../Content/jquery-ui.css" rel="stylesheet" />

    <!-- ************************************************************************************************** -->
    <!-- Body Copy -->
    <!-- ************************************************************************************************** -->
    <input type="hidden" id="uxPagePath" runat="server" value="AddVideos.aspx" class="pageName" />
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="addTitle active">Add Video</li>
        <li class="editTitle active" style="display:none">Edit Video</li>
    </ol>

    <!-- ************************************************************************************************** -->
    <!-- Add Video -->
    <!-- ************************************************************************************************** -->
    <div class="title addTitle ">Add Video</div>
    <div class="title editTitle" style="display:none">
        <span>Edit Video / </span>
        <a style="margin-left:370px;" href="#" 
            data-bind="attr: { 'href': $root.GetAddNewVideoLink() }">Add New Video</a>
    </div>

    <div class="formContent">

        <div id="selectAccount" class="form-group">
            <label class="required">Select Account</label>
            <select id="ddlSelectAccount" class="form-control"
                data-bind="foreach: AccountListData">
                <option data-bind="text: PropertyName, attr: { 'data-item-id': PropertyId }, value: $root.GetWriteToken($data)"></option>
            </select>
        </div>

        <div class="editVideoInfo" style="display: none">
            <div class="title">
                Edit Video - "Greg test avi source file" 
            </div>
            <table> 
                <tr>
                    <td>
                        <label>Account</label></td>
                    <td>Internal2</td>
                </tr>
                <tr>
                    <td>
                        <label>Video ID</label></td>
                    <td>123456789234</td>
                </tr>
                <tr>
                    <td>
                        <label>Reference ID</label></td>
                    <td>0421578</td>
                </tr>
            </table>
        </div>

        <div id="standardFields">
            <label id="referenceIdLabel" style="display:none;">Reference ID</label>
            <input id="txtRefereneId" style="display:none" class="form-control"
                data-bind="value: VideoData().ReferenceID" disabled="disabled" />

            <label id="referenceIdLabel" style="display:none;">SharePoint ID</label>
            <input id="txtRefereneId" style="display:none" class="form-control"
                data-bind="value: VideoData().SPID" disabled="disabled" />

            <label class="required">Name</label>
            <input id="txtName" class="form-control validate"
                data-bind="value: VideoData().VideoTitle"
                placeholder="The name of the video" />

            <label class="required">Short Description</label>
            <input id="txtShortDescription" class="form-control validate"
                data-bind="value: VideoData().VideoShortDescription"
                placeholder="Short description here..." />

            <label>Long Description</label>
            <textarea id="txtLongDescription" runat="server" class="form-control"
                data-bind="value: VideoData().VideoLongDescription"
                placeholder="Long description here..." />

            <label class="required">Is Active</label>
            <select id="ddlActive" class="form-control validate" 
                data-bind="value: VideoData().Active">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
                <option value="DELETED">Deleted</option>
            </select>

            <label>Related Link URL</label>
            <input id="txtRelatedLinkURL" class="form-control"
                data-bind="value: VideoData().RelatedLink" />

            <label>Related Link Text</label>
            <input id="txtRelatedLinkText" class="form-control"
                data-bind="value: VideoData().RelatedLinkText" />

            <label class="required">Video Still 
            </label>
            <br /><img data-bind="visible: VideoData().VideoStillImage, attr: { 'src': VideoData().VideoStillImage }" style="width:95%"/>
            <input class="validate" type='file' name='videoStill' id="videoStill"
                accept="image/gif, image/jpeg, image/jpg, image/png" />

            <label class="required">Thumbnail
            </label>
            <br /><img data-bind="visible: VideoData().VideoThumbNail, attr: { 'src': VideoData().VideoThumbNail }" style="width:95%"/>
            <input class="validate" type='file' name='thumbnail' id="thumbnail"
                accept="image/gif, image/jpeg, image/jpg, image/png" />

            <label>Start Availability Date</label>
            <input id="txtStartDate" class="form-control"
                data-bind="value: VideoData().VideoStartDate" onCopy="return false" onDrag="return false" onDrop="return false" onPaste="return false" />

            <label>End Availability Date</label>
            <input id="txtEndDate" class="form-control"
                data-bind="value: VideoData().VideoEndDate"  onCopy="return false" onDrag="return false" onDrop="return false" onPaste="return false"/>

            <label>Economics</label>
            <select id="ddlEconomics" class="form-control"
                data-bind="value: VideoData().Economics">
                <option value="FREE">Free</option>
                <option value="AD_SUPPORTED">Ad Supported</option>
            </select>

            <label>
                Brightcove Tags
                <br />
                (comma-separated)</label>
            <input id="brightcoveTags" class="form-control"
                data-bind="value: VideoData().Keywords" />
        </div>

        <label id="videoFileLabel" class="required">Video File(s)</label>
        <div id="create_video" method="post" enctype="multipart/form-data"
            target="postFrame" action="https://api.brightcove.com/services/post">
            <input type="hidden" name="JSONRPC" id="JSONRPC" />
                        
            <input class="validate" type="file" id="videoFile" name="filePath" accept=".mp4"/>
            <input name="JSONView" id="JSONView" style="width: 100%; border: none; display: none" />
        </div>
        <br clear="all" />
        <div id="submitVideo" class="bottom-buttons">
            <input type="button" id="btnSave" value="Save" class="btn btn-primary"
                data-bind="click: AddVideo" />
        </div>
        <br clear="both" />
    </div>
                
        <iframe id="postFrame" name="postFrame" 
            style="width: 100%; border: none; display: none" onload=""></iframe>
                    
        <div id="reload" class="bottom-buttons" style="display: none">
            <h4>Item has been succesfully uploaded</h4>
            <a href="#" id="btnReload" class="btn btn-primary"
            data-bind="attr: { 'href': $root.GetAddNewVideoLink() }">Add Another Video</a>
        </div>
    <!-- ************************************************************************************************** -->
    <!-- End Body Copy -->
    <!-- ************************************************************************************************** -->
            
</asp:Content>
