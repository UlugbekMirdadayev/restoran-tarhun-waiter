export const BASE_URL = 'https://crmtarhun.dadabayev.uz/api/';
export const IMG_URL = 'https://crmtarhun.dadabayev.uz/';

export const sendMessageTelegram = (message = '', chatID) => {
  const config = {
    BotKey: '6815680109:AAFyWciJDx-CtVDjBZ_MeVx0VvK2Q7LXzuM', // @botfather
    ChatId: {
      cakes: '-1002103980761',
      fast_food: '-1002082177646',
      shashlik: '-1002046997640',
      tea_house: '-1002003330423'
    } // chatID
  };
  return `https://api.telegram.org/bot${config.BotKey}/sendMessage?chat_id=${config.ChatId[chatID]}&disable_web_page_preview=true&parse_mode=HTML&text=${message}`;
};
export const departments = [
  {
    label: 'Fast food',
    value: 'fast_food',
    index: 0,
    printer: 'fast-food'
  },
  {
    label: 'Shashlik',
    value: 'shashlik',
    index: 1,
    printer: 'shashlik'
  },
  {
    label: 'Tortlar/Shirinliklar',
    value: 'cakes',
    index: 2,
    printer: 'cakes'
  },
  {
    label: 'Choyxona',
    value: 'tea_house',
    index: 3,
    printer: 'choyxona'
  }
];
