import { MissionUtils } from "@woowacourse/mission-utils";

class App {
  async run() {
    const input = await MissionUtils.Console.readLineAsync("덧셈할 문자열을 입력해 주세요.");
    if (!input) {
      throw new Error("[ERROR] 입력값이 없습니다.");
    }
    const result = this.calculate(input);
    MissionUtils.Console.print(`결과 : ${result}`);
  }

  calculate(input) {
    if (!input) {
      return 0;
    }

    const separators = [":", ","];
    let processedInput = input;

    // 커스텀 구분자 처리
    if (input.startsWith("//")) {
      const separated = input.replace(/\\n/g, "\n").split("\n");
      const customSeparator = separated[0].split("//")[1];
      if (customSeparator.length > 1) {
        throw new Error("[ERROR] 구분자의 길이가 1이 아닙니다.");
      }
      separators.push(customSeparator);
      processedInput = separated[1] || "";
    }

    if (!processedInput) {
      throw new Error("[ERROR] 계산할 값이 없습니다.");
    }

    // 숫자 추출
    let total = 0;
    let trackingSum = 0;

    for (const ch of processedInput) {
      if ("0" <= ch && ch <= "9") {
        trackingSum = trackingSum * 10 + (ch - "0");
      } else if (separators.includes(ch)) {
        total += trackingSum;
        trackingSum = 0;
      } else {
        // 양수나 separator가 아니면 에러
        throw new Error("[ERROR] 잘못된 입력입니다");
      }
    }

    total += trackingSum;
    return total;
  }
}

export default App;
