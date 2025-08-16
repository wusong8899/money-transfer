import { extend } from "flarum/extend";
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import TransferMoneyModal from './components/transfer-money-modal';
import type { Vnode } from 'mithril';
import type User from 'flarum/common/models/User';
import app from 'flarum/forum/app';
import {
  CSS_DISPLAY_NONE,
  CSS_VISIBILITY_HIDDEN,
  ROUTE_TAGS,
  CUSTOMIZATION_ENABLED
} from './constants';

const CHECK_TIME_INTERVAL = 10;
const MIN_ITEM_COUNT = 0;

const detachTransferMoneyMenu = (): void => {
  const moneyTransferClient1Customization = app.forum.attribute('moneyTransferClient1Customization');

  if (moneyTransferClient1Customization !== CUSTOMIZATION_ENABLED) {
    return;
  }

  const transferMoneyLabelContainer = document.getElementById("transferMoneyLabelContainer");

  if (transferMoneyLabelContainer !== null) {
    $(transferMoneyLabelContainer).remove();
    // $("#app-navigation").css("height","var(--header-height-phone)");
    // $("#content .container .IndexPage-results").css("marginTop","15px");
  }
};

const attachTransferMoneyMenu = (vdom: Vnode<unknown>, _user: User): void => {
  const isMobileView = $("#drawer").css('visibility') === CSS_VISIBILITY_HIDDEN;
  const moneyTransferClient1Customization = app.forum.attribute('moneyTransferClient1Customization');

  if (isMobileView === false) { return; }
  if (moneyTransferClient1Customization !== CUSTOMIZATION_ENABLED) { return; }

  $("#content .IndexPage-nav .item-nav").css("display", CSS_DISPLAY_NONE);
  $("#content .IndexPage-nav .item-newDiscussion").remove();

  const task = setInterval(function checkDomReady(): void {
    if (vdom.dom) {
      clearInterval(task);

      if (vdom.dom) {
        $("#content .IndexPage-nav .item-nav").css("display", CSS_DISPLAY_NONE);
        $("#content .IndexPage-nav .item-newDiscussion").remove();

        let transferMoneyLabelContainer = document.getElementById("transferMoneyLabelContainer");

        if (transferMoneyLabelContainer !== null) {
          return;
        }

        $("#content .IndexPage-nav .item-nav .ButtonGroup").removeClass("App-titleControl");
        $("#content .IndexPage-nav .item-nav .ButtonGroup button").addClass("Button--link");
        let itemNav = $("#content .IndexPage-nav .item-nav").clone();

        if (itemNav.length > MIN_ITEM_COUNT) {
          $("#itemNavClone").remove();
          $(itemNav).attr('id', "itemNavClone");
          $(itemNav).css('display', "");
          $("#header-secondary .Header-controls").prepend(itemNav);
        }

        const appNavigation = document.getElementById("app-navigation");
        const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
        const userMoneyText = moneyName.replace('[money]', app.session.user.attribute("money"));

        transferMoneyLabelContainer = document.createElement("div");
        transferMoneyLabelContainer.id = "transferMoneyLabelContainer";
        transferMoneyLabelContainer.className = "clientCustomizeWithdrawalButtonContainer";

        const transferMoneyContainer = document.createElement("div");
        transferMoneyContainer.className = "clientCustomizeWithdrawalHeaderItems clientCustomizeWithdrawalHeaderTotalMoney";

        const transferMoneyText = document.createElement("div");
        transferMoneyText.innerHTML = '<span style="font-size:16px;"><i class="fab fa-bitcoin" style="padding-right: 8px;color: gold;"></i></span>' + userMoneyText;
        transferMoneyText.className = "clientCustomizeWithdrawalHeaderText"

        const transferMoneyIcon = document.createElement("div");
        transferMoneyIcon.innerHTML = '<i class="fas fa-wallet"></i>';
        transferMoneyIcon.className = "clientCustomizeWithdrawalHeaderIcon";

        transferMoneyContainer.appendChild(transferMoneyText);
        transferMoneyContainer.appendChild(transferMoneyIcon);

        const transferMoneyButtonText = document.createElement("div");
        transferMoneyButtonText.innerHTML = app.translator.trans('wusong8899-transfer-money.forum.withdrawal');
        transferMoneyButtonText.className = "clientCustomizeWithdrawalHeaderItems clientCustomizeWithdrawalHeaderWithdrawal";

        $(transferMoneyButtonText).click(function showTransferModal(): void {
          app.modal.show(TransferMoneyModal);
        });

        const userAvatarContainer = document.createElement("div");
        userAvatarContainer.className = "clientCustomizeWithdrawalHeaderItems clientCustomizeWithdrawalHeaderUser";

        const avatarClone = $("#header-secondary .item-session .SessionDropdown").clone();
        $(avatarClone).attr('id', "avatarClone");
        $(avatarClone).addClass("App-primaryControl");

        $(userAvatarContainer).html(avatarClone);

        let hideNavToggle = "";
        $(avatarClone).on('click', function toggleNavigation(): void {
          if (hideNavToggle === "") {
            hideNavToggle = CSS_DISPLAY_NONE;
          } else {
            hideNavToggle = "";
          }
          $("#content .IndexPage-nav").css("display", hideNavToggle);
        });

        transferMoneyLabelContainer.appendChild(transferMoneyContainer);
        transferMoneyLabelContainer.appendChild(transferMoneyButtonText);
        transferMoneyLabelContainer.appendChild(userAvatarContainer);
        appNavigation.appendChild(transferMoneyLabelContainer);
      }
    }
  }, CHECK_TIME_INTERVAL);
};

const addClient1CustomizationFeatures = (): void => {
  extend(SessionDropdown.prototype, 'view', function handleSessionDropdownView(vnode): void {
    if (!app.session.user) {
      return;
    }

    const routeName = app.current.get('routeName');

    if (routeName) {
      if (routeName !== ROUTE_TAGS) {
        detachTransferMoneyMenu();
      } else {
        attachTransferMoneyMenu(vnode, this.attrs.user);
      }
    }
  });
};

export default addClient1CustomizationFeatures;
