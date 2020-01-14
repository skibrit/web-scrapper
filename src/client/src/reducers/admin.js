import { SCRAPE_DONE, RESET_SCRAPER, REMOVE_PROPERTY } from "../constants";

const defaultStates = {
  scrapeResult: []
};

export default (state = defaultStates, action) => {
  const { type, payload } = action;
  switch (type) {
    case SCRAPE_DONE:
      return { ...state, scrapeResult: payload };
    case RESET_SCRAPER:
      return { ...state, scrapeResult: [] };
    case REMOVE_PROPERTY:
      return {
        ...state,
        scrapeResult: state.scrapeResult.filter(item => item.code != payload)
      };
    default:
      return state;
  }
};
