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

    <input type="hidden" id="uxPagePath" runat="server" value="ManagePlaylists.aspx" class="pageName" />

    <input type="hidden" id="Hidden1" runat="server" value="AddVideos.aspx" class="pageName" />
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="active">Manage Playlists</li>
    </ol>

    <!-- ************************************************************************************************** -->
    <!-- Manage Playlists -->
    <!-- ************************************************************************************************** -->

    <div class="title">Manage Playlists</div>

    <div class="formContent">
        <label>Select Account</label>
        <select id="ddlSelectAccount" class="form-control"
            data-bind="foreach: AccountListData">
            <option data-bind="text: PropertyName, value: $root.GetReadToken($data), attr: { 'data-item-id': PropertyId, 'data-write-token': $root.GetWriteToken($data) }"></option>
        </select>
                    
        <table id="tblPlaylists" class="table table-striped">
            <thead>
                <tr>
                    <td>
                        <a class="sortable" data-sf="name" href="#" 
                            data-bind="click: SortList">Name</a>
                    </td>
                    <td>
                        <a class="sortable" data-sf="desc" href="#" 
                            data-bind="click: SortList">Short Description</a>
                    </td>
                    <td>
                        <a class="sortable" data-sf="type" href="#" 
                            data-bind="click: SortList">Type</a>
                    </td>
                    <td>
                        <a class="sortable" data-sf="id" href="#" 
                            data-bind="click: SortList">ID</a>
                    </td>
                    <td>
                        <a class="sortable" href="#">Edit Link</a>
                    </td>
                </tr>
            </thead>
            <tbody id="databound" data-bind="foreach: PlayListData">
                <tr data-bind="attr: { 'data-name': Title, 'data-id': ID, 'data-desc': ShortDescription, 'data-type': $root.GetPlaylistTypeForSort(PlaylistType()) }">
                    <td>
                        <a class="name playlistItems" href="#"
                            data-bind="text: Title, attr: { 'data-vids': VideoIDs, 'data-pid': ID, 'data-name': Title }">Playlist 1</a>
                        <br />
                        <span>Video IDs in list: </span>
                        <br />
                        <span data-bind="text: $root.ShortenIDList(VideoIDs())"></span>
                    </td>
                    <td data-bind="text: ShortDescription">Lorem ipsum dela tedium</td>
                    <td data-bind="text: $root.GetPlaylistType(PlaylistType())">Manual</td>
                    <td data-bind="text: ID">3740798383001</td>
                    <td>
                        <a class="name playlistItems" 
                            data-bind="attr: { 'data-vids': VideoIDs, 'data-pid': ID, 'data-name': Title }">Edit</a>
                    </td>
                </tr>
            </tbody>
            <tbody id="sorted" style="display:none"></tbody>
        </table>
        <div class="bottom">
            <a id="btnAddNewPlaylist" class="btn btn-default" data-bind="click: LoadPlaylistEditor">Add New Playlist</a>
        </div>
    </div>

    <!-- ************************************************************************************************** -->
    <!-- Account Modals -->
    <!-- ************************************************************************************************** -->
    <!-- Modals -->
    <div class="modal newPlaylistModal fade" id="TokenPropertyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span>Add New Playlist</span>
                    </h4>
                </div>
                <div class="modal-body">
                    <div class="editMode">
                        <label>Playlist ID:</label>
                        <span id="pid">32165498732101</span>
                        <label>Account:</label>
                        <span class="accountLabel">Internal2</span>
                        <br />
                        <br />
                    </div>
                    <label>Name: </label>
                    <input type="text" id="txtName" class="form-control" />

                    <label>Description: </label>
                    <input type="text" id="txtDescription" class="form-control" />

                    <label>Type: </label>
                    <select id="ddlNewType" class="form-control">
                        <option>Manual</option>
                        <option>Smart</option>
                    </select>

                    <hr class="smartPlaylistHR smartList" />

                    <div class="smartPlaylistSettings smartList">
                        <div class="heading">Smart Playlist Settings</div>
                        <div class="settingsText">Videos will be automatically added to this Playlist based on the following settings:</div>

                        <label>Tags:</label>
                        <select id="uxSmartPlaylistContains" class="form-control">
                            <option value="OR">Contain one or more</option>
                            <option value="AND">Contain all</option>
                        </select>
                        <br />
                        <label style="font-weight: normal;">of the following:</label>
                        <input type="text" id="smartTags" class="form-control" />
                        <br />
                        <label>Order:</label>
                        <select id="smartSortOder" class="form-control">
                            <option value="ALPHABETICAL">Alphabetical</option>
                            <option value="NEWEST_TO_OLDEST">Activated Date (newest first)</option>
                            <option value="OLDEST_TO_NEWEST">Activated Date (oldest first)</option>
                            <option value="PLAYS_TOTAL">Total Plays</option>
                            <option value="PLAYS_TRAILING_WEEK">Trailing Week Plays</option>
                            <option value="START_DATE_OLDEST_TO_NEWEST">Start Date (oldest first)</option>
                            <option value="START_DATE_NEWEST_TO_OLDEST">Start Date (newest first)</option>
                        </select>
                        <br />
                        <label>Limit to: </label>
                        <input type="text" id="smartPageSize" style="width: 50px;" class="form-control" />
                        <button type="button" id="btnPreview" class="btn btn-default"
                            data-bind="click: PreviewSmartlist">Preview</button>
                    </div>

                    <hr />
                    <div class="manualListControl">
                        <div class="availableVideoSearch">
                            <label>Available Videos</label>
                            <div class="input-group">
                                <input type="search" placeholder="Search" class="txtSearchVideos form-control" />
                                <div class="input-group-btn searchButton">
                                    <a class="btn btn-default searchBtn" type="submit"><i class="glyphicon glyphicon-search"></i></a>
                                </div>
                            </div>
                            <%--<span class="btnSearchVideos glyphicon glyphicon-search"></span>--%>
                        </div>

                        <div class="playlistOrder">
                            <label>Videos in this Playlist</label>
                            <br />
                            <input id="cbxMove" type="checkbox" />
                            <span class="moveCheckbox">Move Video</span>
                            <div class="buttons btn-group btn-group-sm">
                                <a id="btnUp" class="btn btn-default" disabled="">Up</a>
                                <a id="btnDown" class="btn btn-default" disabled="">Down</a>
                            </div>
                        </div>

                        <div class="availableVideos" data-bind="foreach: FilteredSPVideos">
                            <div class="video" data-bind="attr: { 'data-videoid': VideoID, 'data-referenceid': ReferenceID }">
                                <img class="resultImage" style="width:45%"
                                    data-bind="visible: VideoThumbNail, attr: { 'src': VideoThumbNail }" />
                                <div class="title" data-bind="text: VideoTitle, attr: { 'data-VideoID': VideoID, 'data-ReferenceID': ReferenceID }">Video Item Data</div>
                                <div>
                                    video id: <span data-bind="text: VideoID"></span>
                                </div>
                                <br clear="all"/>
                            </div>
                        </div>

                        <div class="overButtons">
                            <a id="btnRight" class="btn btn-default">>> </a>
                            <br />
                            <a id="btnLeft" class="btn btn-default"><< </a>
                        </div>

                        <div class="newPlaylist" data-bind="foreach: SelectedVideosFromFilter">
                            <div class="video">
                                <img class="resultImage" style="width: 45%" data-bind="visible: VideoThumbNail, attr: { 'src': VideoThumbNail }" />
                                <br />
                                <div class="title" data-bind="text: VideoTitle, attr: { 'data-VideoID': VideoID, 'data-ReferenceID': ReferenceID }">Video Item Data</div>
                                <div>
                                    id: 
                                    <span data-bind="text: VideoID"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="create_playlist" method="POST" enctype="multipart/form-data"
                        target="postFrame" action="https://api.brightcove.com/services/post" style="display: none;">
                        <fieldset>
                            <legend>JSON Request</legend>
                            <input name="JSONView" id="JSONView" style="width: 100%; border: none; display: none"></input>
                        </fieldset>
                    </div>
                    <%--This list is set from SmartList Preview button--%>
                    <div class="smartListControl">
                        <label>Videos in this Playlist: </label>
                        <br />
                        <div class="availableVideos" data-bind="foreach: SmartPlaylistVideos">
                            <div class="video">
                                <img class="resultImage" style="width: 45%" 
                                    data-bind="visible: VideoThumbNail, attr: { 'src': VideoThumbNail }" />
                                <br />
                                <div class="title" data-bind="text: VideoTitle">Video Title</div>
                                <div data-bind="text: VideoID">id: 32165498765321</div>
                                <br clear="all"/>
                            </div>
                        </div>
                    </div>

                    <iframe id="postFrame" name="postFrame"
                        style="width: 100%; border: none; display: none"></iframe>
                </div>
                <div class="modal-footer" style="clear: both;">
                    <button type="button" class="btn btn-primary" data-bind="click: SavePlaylist">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-default editMode" data-bind="click: DeletePlaylist">Delete Playlist</button>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        $(document).ready(function () {

            $('#tblPlaylists .editList').click(function () {
                $('.newPlaylistModal').modal('show');
                modalEditMode();
            });

            availableVideosClick();

            $('#btnRight').click(function () {
                $('.manualListControl .availableVideos .video.selected').remove().appendTo('.newPlaylist');
                $('.newPlaylist .video').removeClass('selected');
                newPlaylistClick();
                return false;
            });

            $('#btnLeft').click(function () {
                $('.newPlaylist .video.selected').remove().appendTo('.manualListControl .availableVideos');
                $('.manualListControl .availableVideos .video').removeClass('selected');
                availableVideosClick();
                return false;
            });

            $('.availableVideoSearch .searchBtn').click(function () {
                $('.searchCancel').remove();
                $('.availableVideos .video').show();

                var term = $('.txtSearchVideos').val().toLowerCase();

                $('.availableVideos .video .title').each(function () {
                    var text = $(this).text().toLowerCase();

                    if (text.indexOf(term) < 0) {
                        $(this).parent().hide();
                    }
                });
                $('.availableVideos').prepend('<div class="searchCancel">Search: <b>' + term + '</b> <a class="btnSearchCancel">Cancel</a> </div>');
                addSearchCancel();
            });

            $(".txtSearchVideos").keyup(function (event) {
                if (event.keyCode == 13) {
                    $('.availableVideoSearch .searchBtn').click();
                    return false;
                }
            });

            $('#cbxMove').change(function () {
                if ($('.newPlaylist .selected').length > 1) {
                    $('.newPlaylist .video').removeClass('selected');
                }

                if ($('#cbxMove').is(':checked')) {
                    setMoveButtons();
                } else {
                    unsetMoveButtons();
                }
            });

            $('#ddlNewType').change(function () {
                var val = $('#ddlNewType').val().toLowerCase();
                if (val == 'smart') {
                    $('.smartPlaylistSettings').slideDown('slow');
                    $('.smartList:not(.smartPlaylistSettings)').show('slow');

                    $('.manualListControl').hide();
                    $('.smartListControl').show();
                } else {
                    $('.smartPlaylistSettings').slideUp('slow');
                    $('.smartList:not(.smartPlaylistSettings)').hide('slow');

                    $('.manualListControl').show();
                    $('.smartListControl').hide();
                }
            });

        });//End (doc).ready

        function availableVideosClick() {
            $('.manualListControl .availableVideos .video').unbind().click(function () {
                $(this).toggleClass('selected');
            });
        }
        function newPlaylistClick() {
            $('.manualListControl .newPlaylist .video').unbind().click(function () {
                if ($('#cbxMove').is(':checked')) {
                    $('.newPlaylist .video').removeClass('selected');
                    $(this).addClass('selected');
                }
                else {
                    $(this).toggleClass('selected');
                }
            });
        }
        function addSearchCancel() {
            $('.btnSearchCancel').click(function () {
                $('.searchCancel').remove();
                $('.txtSearchVideos').val('');
                $('.availableVideos .video').show();
            });
        }

        function setMoveButtons() {
            $('#btnUp').click(function () {
                var current = $('.newPlaylist .selected');
                current.prev().before(current);
            });
            $('#btnDown').click(function () {
                var current = $('.newPlaylist .selected');
                current.next().after(current);
            });
            $('#btnUp').attr('disabled', false);
            $('#btnDown').attr('disabled', false);
        }
        function unsetMoveButtons() {
            $('#btnUp').unbind().attr('disabled', true);
            $('#btnDown').unbind().attr('disabled', true);
        }
        function modalEditMode() {
            //load data
            $('#ddlNewType').change();
            $('.modal-header h4 span').html('Edit Playlist');
            $('.newPlaylistModal .editMode').show();
        }
        function modalNewMode() {
            $('.modal-header h4 span').html('Add New Playlist');
            $('.newPlaylistModal .editMode').hide();
        }
    </script>
    <!-- ************************************************************************************************** -->
    <!-- End Body Copy -->
    <!-- ************************************************************************************************** -->

</asp:Content>
