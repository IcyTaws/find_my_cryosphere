/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav(selector_str) {
    $('#sidebar').css('width','250px');
}
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav($btn) {
    $btn.parent('.sidebar').css('width','0px');
}