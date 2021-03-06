﻿<%@ Register TagPrefix="WpNs0" Namespace="BrightcoveVideoCloudIntegration.VideoEditor" Assembly="BrightcoveVideoCloudIntegration, Version=1.0.0.0, Culture=neutral, PublicKeyToken=6a792aa6dfad51a4"%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ID="Content1" ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	Edit Video Properties
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">
										<h2>
                                        </h2>
										<WebPartPages:SPProxyWebPartManager runat="server" ID="__ProxyWebPartManagerForConnections__"></WebPartPages:SPProxyWebPartManager>
										<WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderId="PlaceHolderTitleAreaClass" runat="server">
	<style type="text/css">
	Div.ms-titleareaframe {
	height: 100%;
	}
	.ms-pagetitleareaframe table {
	background: none;
	}
  </style>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	<script type="text/javascript">
// <![CDATA[
	    var navBarHelpOverrideKey = "WSSEndUser";
// ]]>
	</script>
	<SharePoint:UIVersionedContent ID="WebPartPageHideQLStyles" UIVersion="4" runat="server">
		<ContentTemplate>
<style type="text/css">
body #s4-leftpanel {
	display:none;
}

#s4-ribbonrow
{
	display:none;
}
</style>
		</ContentTemplate>
	</SharePoint:UIVersionedContent>
    <link rel="stylesheet" type="text/css" href="style1.css" />
	<link rel="stylesheet" href="themes/base/jquery.ui.all.css" />
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
	<SharePoint:DelegateControl ID="DelegateControl1" runat="server"
		ControlId="SmallSearchInputBox"/>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderId="PlaceHolderLeftActions" runat="server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
	<SharePoint:ProjectProperty ID="ProjectProperty1" Property="Description" runat="server"/>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderId="PlaceHolderBodyRightMargin" runat="server">
	<div height="100%" class="ms-pagemargin"><img src="/_layouts/images/blank.gif" width="10" height="1" alt="" /></div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderId="PlaceHolderPageImage" runat="server"></asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderId="PlaceHolderNavSpacer" runat="server"></asp:Content>
<asp:Content ID="Content11" ContentPlaceHolderId="PlaceHolderLeftNavBar" runat="server"></asp:Content>
<asp:Content ID="Content12" ContentPlaceHolderId="PlaceHolderMain" runat="server">
<div id="contentContainer">
	<div id="contentDiv">

		<table cellpadding="4" cellspacing="0" border="0" width="100%">
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" colspan="3" valign="top" width="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:Header" ID="Header" FrameType="TitleBarOnly"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> </td>
				</tr>
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" height="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:LeftColumn" ID="LeftColumn" FrameType="TitleBarOnly"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> </td>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" height="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:MiddleColumn" ID="MiddleColumn" FrameType="TitleBarOnly"><ZoneTemplate>
					<WpNs0:VideoEditor runat="server" AllowEdit="True" AllowConnect="True" ConnectionID="00000000-0000-0000-0000-000000000000" Title="Brightcove Video Cloud Editor" Dir="Default" IsVisible="True" AllowMinimize="True" ExportControlledProperties="True" ID="g_28fd5d3c_8ec4_4867_9216_335e7901153e" FrameState="Normal" ExportMode="All" AllowHide="True" SuppressWebPartChrome="False" DetailLink="" HelpLink="" MissingAssembly="Cannot import this Web Part." PartImageSmall="" AllowRemove="True" HelpMode="Modeless" FrameType="Default" AllowZoneChange="True" Description="" PartImageLarge="" IsIncludedFilter="" __MarkupType="vsattributemarkup" __WebPartId="{28FD5D3C-8EC4-4867-9216-335E7901153E}" WebPart="true" Height="" Width="" partorder="2"></WpNs0:VideoEditor>

</ZoneTemplate></WebPartPages:WebPartZone> </td>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" height="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:RightColumn" ID="RightColumn" FrameType="TitleBarOnly"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> </td>
				</tr>
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" colspan="3" valign="top" width="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:Footer" ID="Footer" FrameType="TitleBarOnly"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> </td>
				</tr>
				<script type="text/javascript" language="javascript">				    if (typeof (MSOLayout_MakeInvisibleIfEmpty) == "function") { MSOLayout_MakeInvisibleIfEmpty(); }</script>
		</table>
	</div>
</div>	
<script type="text/javascript" src="ui/jquery.ui.core.js"></script>
<script type="text/javascript" src="ui/jquery.ui.widget.js"></script>
<script type="text/javascript" src="ui/jquery.ui.datepicker.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$(".datepicker").datepicker({
			showOn: "both",
			buttonImage: "images/calendar_icon.jpg",
			buttonImageOnly: true
		});
});
</script>
</asp:Content>
