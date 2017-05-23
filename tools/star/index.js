$(function () {

  let t;

  $("div i").mouseenter(function () {
    clearTimeout(t);
    const $this = $(this);
    $this.nextAll().removeClass('fa-star').addClass("fa-star-o");
    $this.prevAll().removeClass("fa-star-o").addClass('fa-star');
    $this.removeClass("fa-star-o").addClass('fa-star');
  });

  $("div i").mouseleave(function () {
    const select = $('.active');
    const $this = $(this);
    select.nextAll().removeClass('fa-star').addClass('fa-star-o');
    select.prevAll().removeClass('fa-star-o').addClass('fa-star');
    select.removeClass('fa-star-o').addClass('fa-star');

    if (select.length === 0) {
      t = setTimeout(function () {
        $this.removeClass("fa-star").addClass('fa-star-o');
        $this.siblings().removeClass("fa-star").addClass('fa-star-o');
      }, 200);
    }
  });

  $("div i").click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $(this).attr("style", "color:#7F6A15");
    $(this).prevAll().css("color", "#7F6A15");
    $(this).nextAll().css("color", "#7F6A15");

  });
});
