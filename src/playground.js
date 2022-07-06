
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

function getBreakPointWidth(widthOfElement, breakPoints) {
    const keys = Object.keys(breakPoints[0]);
    const _keys = keys.map(key => parseInt(key));

    const test = _keys.reduce((prev, cur) => {
        if (prev < widthOfElement && cur > widthOfElement) {
            return Math.min(prev, cur);
        } 
        return cur;
    })
    return breakPoints[0][test];
}

const foo = getBreakPointWidth(850, bPs);
console.log("🚀 ~ file: playground.js ~ line 31 ~ foo", foo)
getBreakPointWidth(905, bPs);
getBreakPointWidth(1105, bPs);
getBreakPointWidth(1205, bPs);

