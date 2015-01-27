<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <%--<link rel="Stylesheet" type="text/css" href="../Content/App.css" />--%>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    
    <!-- ************************************************************************************************** -->
    <!-- Body Copy -->
    <!-- ************************************************************************************************** -->
    <input type="hidden" id="uxPagePath" runat="server" value="AccountManagement.aspx" class="pageName" />
                
    <!-- ************************************************************************************************** -->
    <!-- Breadcrumb -->
    <!-- ************************************************************************************************** -->
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="active">Account Management</li>
    </ol>


    <!-- ************************************************************************************************** -->
    <!-- Account Add/Select View -->
    <!-- ************************************************************************************************** -->

    <div class="loadingLogo hideSection"></div>

    <div id="AccountSelect">
        <table id="AccountSelectTbl" class="table table-striped">
            <thead>
                <td>Account Title</td>
                <td>AuthorsGroup</td>
                <td>ViewersGroup</td>
            </thead>
            <tbody data-bind="foreach: AccountListData">
                <tr>
                    <td>
                        <button onclick="return false;" class="btn btn-primary btn-lg account mLinks"
                            data-bind="attr: { 'data-item-id': PropertyId, 'data-item-index': $index }"
                            data-toggle="showhide" data-hidetarget="#AccountSelect" data-target="#AccountEdit">
                            <span data-bind="text: PropertyName"></span>
                        </button>
                    </td>
                    <td>
                        <span data-bind="text: AccountAuthorsGroupName"></span>
                    </td>
                    <td>
                        <span data-bind="text: AccountViewersGroupName"></span>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />
        <div>
            <button class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: AddAccount">
                <span class="glyphicon glyphicon-plus"></span>
                <a id="AddAccountBtn" href="javascrit:void(0)"
                    data-toggle="showhide"
                    data-hidetarget="#AccountSelect"
                    data-target="#AccountEdit">Add new account</a>
            </button>
            <hr />


        </div>
    </div>
    <!-- ************************************************************************************************** -->
    <!-- Account Edit View -->
    <!-- ************************************************************************************************** -->
    <div id="AccountEdit" class="hideSection">
        <table id="AccountEditTbl" class="table table-striped">
            <thead>
                <td>Property</td>
                <td>Value</td>
                <td>Description</td>
            </thead>
            <tbody>
                <tr>
                    <td class="NameField">
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountName" data-bind="click: ShowPropModal">
                            Account Name
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountName"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().PropertyName">
                            <span data-bind="text: CurrentAccount().PropertyName"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the account name</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PublisherId" data-bind="click: ShowPropModal">
                            PublisherId
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PublisherId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DefaultPublisherId">
                            <span data-bind="text: CurrentAccount().DefaultPublisherId"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the publisher id of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="VideoPlayerId" data-bind="click: ShowPropModal">
                            DefaultVideoPlayerId
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="VideoPlayerId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DefaultVideoPlayerId">
                            <span data-bind="text: CurrentAccount().DefaultVideoPlayerId"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the default video player of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PlayListId" data-bind="click: ShowPropModal">
                            DefaultPlaylistPlayerId
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PlayListId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DefaultPlaylistPlayerId">
                            <span data-bind="text: CurrentAccount().DefaultPlaylistPlayerId"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the default playlist id of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ReadAPIServiceURL" data-bind="click: ShowPropModal">
                            ReadAPIServiceURL
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ReadAPIServiceURL"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().ReadAPIServiceURL">
                            <span data-bind="text: CurrentAccount().ReadAPIServiceURL"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the read api service url of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="WriteAPIServiceURL" data-bind="click: ShowPropModal">
                            WriteAPIServiceURL
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="WriteAPIServiceURL"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().WriteAPIServiceURL">
                            <span data-bind="text: CurrentAccount().WriteAPIServiceURL"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the write service url of the account</td>
                </tr>
            </tbody>
        </table>

        <hr />
        <h5 style="font-weight: bold">Tokens</h5>
        <table id="AccountTokensTbl" class="table table-striped">
            <thead>
                <td>Value</td>
                <td>Type</td>
            </thead>
            <tbody data-bind="foreach: CurrentReadTokens">
                <tr class="tokenData">
                    <td data-bind="attr: { 'data-item-index': $index }">
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="Tokens"
                            data-bind="click: $parent.ShowTokenPropModal, attr: { 'data-item-index': $index, 'data-token-type': $root.FormatTokenType($data) }">
                            <span data-bind="text: $root.FormatToken($data)"></span>
                        </button>
                    </td>
                    <td data-bind="text: $root.FormatTokenType($data)">Read</td>
                </tr>
            </tbody>
        </table>

        <div>
            <button class="btn btn-default" data-bind="click: AddToken">
                <a href="javascrit:void(0)" data-toggle="showhide">Add Token</a>
            </button>
        </div>
        <hr />
        <table id="AccountGroupsTbl" class="table table-striped">
            <thead>
                <td>Group</td>
                <td>Value</td>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AuthorsGroup" data-bind="click: ShowGroupsPropModal">
                            Author's Group
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AuthorsGroup"
                            data-bind="click: ShowGroupsPropModal">
                            <span data-bind="text: CurrentAccount().AccountAuthorsGroupName"></span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ViewersGroup" data-bind="click: ShowGroupsPropModal">
                            Viewer's Group
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ViewersGroup"
                            data-bind="click: ShowGroupsPropModal">
                            <span data-bind="text: CurrentAccount().AccountViewersGroupName"></span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <hr />
            <button class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: SaveAccountChanges">
                <a href="javascrit:void(0)" data-toggle="showhide">Save Account</a>
            </button>
            <button class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: DeleteAccount">
                <a href="javascrit:void(0)" data-toggle="showhide">Delete Account</a>
            </button>
            <button class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: CancelEdits">
                <a id="CancelEditAccount" href="javascrit:void(0)" data-toggle="showhide"
                    data-hidetarget="#AccountEdit" data-target="#AccountSelect">Cancel</a>
            </button>
        </div>
    </div>

    <!-- ************************************************************************************************** -->
    <!-- Account Modals -->
    <!-- ************************************************************************************************** -->
    <!-- Modals -->
    <div class="modal fade" id="SinglePropertyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <h4>Value</h4>
                    <input type="text" data-bind="value: CurrentModalValueString"></input>
                    <br />
                    <h4>Description</h4>
                    <span data-bind="text: CurrentModalValueDescription"></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary"
                        data-bind="click: SaveSinglePropertyChange">
                        Ok</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="TokenPropertyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <h4>Token Type</h4>
                    <select id="TokenTypeSelect">
                        <option value="Read">Read</option>
                        <option>ReadURL</option>
                        <option>Write</option>
                    </select>
                    <h4>Value</h4>
                    <input type="text" id="TokenField"></input>
                    <br />
                </div>
                <div class="modal-footer">
                    <button id="addToken" type="button" class="btn btn-primary"
                        data-bind="click: SaveTokenPropertyChange">
                        Ok</button>
                    <button id="cancelToken" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button id="deleteToken" type="button" class="btn btn-default"
                        data-bind="click: DeleteToken">
                        Delete</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="AccountGroupManagerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <h4>Select a group</h4>
                    <select id="AuthorsGroupSelect">
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary"
                        data-bind="click: SaveGroupsPropModal">
                        Ok</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ************************************************************************************************** -->
    <!-- End Body Copy -->
    <!-- ************************************************************************************************** -->

</asp:Content>
