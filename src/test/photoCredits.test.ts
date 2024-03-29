import { describe, it, expect } from "vitest";
import { plainGetPhotoCredits } from "../utils/misc";

describe("PhotoCredits", () => {
  it("resolves on normal input name", () => {
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Steffen-Roth-7-optimized.jpg"
      )
    ).toBe("Steffen Roth");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-7-optimized.jpg"
      )
    ).toBe("Christian Van Dalen");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-optimized.jpg"
      )
    ).toBe("Christian Van Dalen");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-opt.jpg"
      )
    ).toBe("Christian Van Dalen");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/05/Franz-Xaver-Zeller©-Elena-Zaucke-18.jpg"
      )
    ).toBe("Elena Zaucke");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/05/Franz-Xaver-Zeller©-Elena-Zaucke.jpg"
      )
    ).toBe("Elena Zaucke");
  });

  it("resolves on somewhat normal input name", () => {
    expect(
      plainGetPhotoCredits("Christian A. Koch_© Jan Merkle (29).jpg")
    ).toBe("Jan Merkle");
    expect(
      plainGetPhotoCredits("Christian A. Koch_©_Jan_Merkle_(29).jpg")
    ).toBe("Jan Merkle");
    expect(
      plainGetPhotoCredits(
        "http://localhost:4444/wp-content/uploads/2022/08/Ausschnitt_Christian_A._Koch__c__Jan_Merkle__12_.jpg"
      )
    ).toBe("Jan Merkle");
  });

  it("removes Kopie", () => {
    expect(
      plainGetPhotoCredits(
        "https://schwanenberg.mokka-webdesign.com/wp-content/uploads/2022/07/David-Bredin©Caroline-Scharff-11-Kopie-optimized.jpg"
      )
    ).toBe("Caroline Scharff");
  });

  it("resolves on normal input name", () => {
    expect(
      plainGetPhotoCredits(
        "Jutta_Fastian_2021_©Marlene_Rahmann_High_Res_78-scaled.jpg"
      )
    ).toBe("Marlene Rahmann");
  });
  it("edge case", () => {
    expect(plainGetPhotoCredits("Jutta_Fastian_2021.jpg")).toBe("");
  });
});
