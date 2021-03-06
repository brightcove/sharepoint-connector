﻿<%@ Assembly Name="BrightcoveVideoCloudIntegration, Version=1.0.0.0, Culture=neutral, PublicKeyToken=6a792aa6dfad51a4" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Chooser.aspx.cs" Inherits="BrightcoveVideoCloudIntegration.Layouts.BrightcoveVideoCloudIntegration.Chooser" %>
<%@ Register TagPrefix="WpNs0" Namespace="BrightcoveVideoCloudIntegration.VideoPicklist" Assembly="BrightcoveVideoCloudIntegration, Version=1.0.0.0, Culture=neutral, PublicKeyToken=6a792aa6dfad51a4"%>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<!doctype html>
    <head>
        <title>Item Chooser</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
<style type="text/css">
body {
 font-family: Verdana,Arial,Helvetica,sans-serif;
 color: #3B3B3B;
 font-size: 8pt;
 background-color: transparent;
}

.picklist.selected {
    display:none;
    }
.result
{
    border-top: 1px solid #ADADAD;
    clear: both;
    height: auto;
    overflow: hidden;
    padding-bottom: 8px;
    padding-top: 10px;
    width: 600px;
}

.result A.videoLink
{
    display: block;
    font-weight: bold;
    width: 82%;
}

.result .description
{
	margin: 0 50px 0 93px;
	padding: 5px 0 0 0;
	width: 400px;
}

.result .tags
{
	clear: both;
	padding: 15px 0 0 93px;
	font-weight:bold;
	width: 400px;
	word-wrap:break-word;
}

.result .thumbnail
{
    float: left;
    height: 100%;
    padding: 0 20px 0 10px;
    width: 64px;
}

.result .thumbnail > IMG
{
	BORDER-BOTTOM: medium none; BORDER-LEFT: medium none; MAX-WIDTH: 64px; MAX-HEIGHT: 64px; BORDER-TOP: medium none; BORDER-RIGHT: medium none;
}

.blueBG 
{
    background: #F9F9F9;
}

/* Picklist styles */
.picklist, .picklistControls
{
    float:left;
    vertical-align:middle;
}

.picklist .content
{
    width:208px;
    height:270px;
}

.picklist .content
{
    /*width:208px;*/
    width:250px;
    height:250px;
    overflow-x:hidden;
    overflow-y:scroll;
	border:1px solid silver;
}

.picklist .videosAvailable
{
	/*height:250px;*/
    overflow-x:hidden;
}
    
.picklist .content .item
{
    /*width:195px;*/
    width:237px;
    height:35px;
    vertical-align:middle;
    clear:both;
    border-bottom:1px solid silver;
    padding-top:5px;
    padding-bottom:5px;
    cursor:pointer;
}
    
.videoName
{
    font-weight:bold;
    color:#000000;
}
    
.videoId
{
    color:Gray;
}

.videoCheckbox
{
    width:25px;
    float:left;
    display:none;
}
    
.videoThumb
{
    width:40px;
    float:left;
    margin-right:5px;
    margin-left:5px;
}

.videoMetadata
{
    width:167px;
    float:left;
    text-wrap:none;
    overflow-x:hidden;
}

.videoMetadata .videoName
{
    display:inline-block;
    width:167px;
    height:15px;
    text-wrap:none;
    overflow-x:hidden;
    white-space: nowrap;
}
    
.videoThumb img
{
    max-width:40px;
    max-height:30px;
}

.picklistControls
{
    display:none;
	margin-top:80px;
	width:100px;
	text-align:center;
}


.picklistControls button
{
    margin-bottom:10px;
    width:80px;
    padding-left:2px;
    padding-right:2px;
}

#divAccount{ margin-top:8px}

.picklistControls .controlSection
{
    display:none;
	margin-bottom:8px;
}

.searchBox
{
    margin-bottom:5px;
}

.searchBox input
{
	/*width:181px;*/
	width:223px;
}

.searchBox button
{
	width:25px;
	background-image:url(/_layouts/images/gosearch15.png);
    min-width:  1px;
    padding: 1px;
}

.searchBox button, .searchBox input
{
	margin:0 0 0 0;
	border:none;
	border:1px solid silver;
}

.searchBox_default_text
{
	font-style:italic;
	color:silver;
}

.videoSelected
{
	background-color:#8bd1ee;
}

#playlistName, #playlistType, #tags, #videos
{
    width:200px;
    font-size:12px;
    font-family: Verdana,Arial,Helvetica,sans-serif;
}

#playlistName, #tags, #videos
{
    height:16px;
}

#playlistType
{
    height:20px;
}

#divPicklist
{
    margin-top:5px;
    
}

.picklist .moveButtons input
{
    vertical-align:middle;
}

.picklist .moveButtons
{
    width:208px;
    height:16px;
    clear:both;
    color:#000000;
    vertical-align:middle;
}

.picklist .moveButtons > input
{
    margin-left:1px;
    float:left;
}

.picklist .moveButtons > span
{
    float:right;
}

.picklist .moveButtons label
{
    margin-top:2px;
    float:left;
    font-weight:normal;
    color:gray;
}

.picklist .moveButtons button
{
    width:50px;
    height:20px;
    font-size:11px;
    padding-top:0;
}

.buttonBlock
{
 margin-left: -124px;
}

.divPicklist, #divPicklist
{
	overflow:hidden;
	
}

.chooserContainer
{
    margin-left:25px;
    
}

body {
    overflow-y: hidden;
    }
.videosAvailable
{
    margin-top: 10px;
	width:250px;
}

#btnSave {
    background-image: url("/_layouts/BrightcoveVideoCloudIntegration/images/btn-homepage-blue.png");
    background-repeat: repeat-x;
    border: 0 none;
    border-radius: 4px 4px 4px 4px;
    padding: 2px 14px;
}    

#btnSave:hover {
    background-image: url("/_layouts/BrightcoveVideoCloudIntegration/images/tertiary-nav-hover.gif");
    background-repeat: repeat-x;
}

#btnCancel {
    background-image: url("/_layouts/BrightcoveVideoCloudIntegration/images/btn-homepage-blue.png");
    background-repeat: repeat-x;
    border: 0 none;
    border-radius: 4px 4px 4px 4px;
    padding: 2px 14px;
}    

#btnCancel:hover {
    background-image: url("/_layouts/BrightcoveVideoCloudIntegration/images/tertiary-nav-hover.gif");
    background-repeat: repeat-x;
}

.paging
{
    text-align:center;
    margin:5px 5px 5px 5px;
    width:150px;
    clear:both;
    display:block;
}

.paging .itemRange
{
    margin-left:20px;
    margin-right:20px;
}

A:link
{
    color: #96a44f;
    font-weight: bold;
    text-decoration: none;
}

A:visited
{
    color: #96a44f;
}
</style>
    </head>
<body>
    <form id="form1" method="post" runat="server">
    <div class="chooserContainer">
     <div id="divAccount">
        Select Account: <asp:DropDownList runat="server" ID="ddlAccount" AutoPostBack="true"></asp:DropDownList>
    </div>
	    <WpNs0:VideoPicklist ID="VideoPicklist1" runat="server" PartOrder="1"></WpNs0:VideoPicklist>

        <script type="text/javascript">
            $(document).ready(function () {
                $('head').append("<base target='_self'>");
                $(".videosSelected").html("");

                if (picklistChooserType == "PlaylistId") {
                    $(".searchBox *").hide();
                    $('input[name=sort]:radio').first().next().remove();
                    $('input[name=sort]:radio').first().remove();
                    $('input[name=sort]:radio').first().click();

                }
                else {
                    $('input[name=sort]:radio').first().click();
                }
            });
        </script>

        <center class="buttonBlock">
            <p>
                <button id="btnSave" onclick="AddSelectedItems();return ChooserDone(true);">OK</button>&nbsp;&nbsp;<button id="btnCancel" onclick="return ChooserCancel(true);">Cancel</button>
            </p>
        </center>
    </div>
    </form>
</body>
</html>

