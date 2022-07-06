
const bPs = [{
    1600: {
      itemsToShow: 2.5,
    },
    1200: {
      itemsToShow: 2,
    },
    900: {
      itemsToShow: 1.5,
    },
    750: {
      itemsToShow: 1,
    }
}];

function getCurrentBreakPointWidth(widthOfElement, breakPoints) {
    const keys = Object.keys(breakPoints[0]);
    const _keys = keys.map(key => parseInt(key));

    const test = _keys.reduce((prev, cur) => {
        if (prev < widthOfElement && cur > widthOfElement) {
            return Math.min(prev, cur);
        } 
        return cur;
    })


    console.log("result", test)
}

getCurrentBreakPointWidth(850, bPs);
getCurrentBreakPointWidth(905, bPs);
getCurrentBreakPointWidth(1105, bPs);
getCurrentBreakPointWidth(1205, bPs);

