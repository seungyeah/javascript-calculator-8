import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

describe("문자열 계산기", () => {
  test("커스텀 구분자 사용", async () => {
    const inputs = ["//;\\n1"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 1"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  // 구분자를 등록하지 않는다면, 콤마와 콜론을 구분자로 사용한다.
  test("구분자를 등록하지 않은 경우", async () => {
    const inputs = ["//\\n1,2,3"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 6"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("알파벳 구분자 사용", async () => {
    const inputs = ["//a\\n1a2a3a"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 6"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });


  test("슬래시를 구분자로 사용", async () => {
    const inputs = ["///\\n1/2/3"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 6"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("에러 케이스: 여러 슬래시를 구분자로 사용 -> 두 글자 이상의 슬래시 처리", async () => {
    const inputs = ["///\\\n1/2/3"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

  test("역슬래시를 구분자로 사용", async () => {
    const inputs = ["//\\\n1\\2\\3"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 6"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("예외 테스트", async () => {
    const inputs = ["-1,2,3"];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

  test("예외 테스트: 구분자가 한글자 이상이 경우", async () => {
    const inputs = ["//;;\\n1;;2;3"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

  test("예외 테스트: 구분자가 숫자인 경우", async () => {
    const inputs = ["//1\\n11213"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });


  test("예외 테스트: 슬래시 1개만 사용", async () => {
    const inputs = ["/;1;2;3"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });


  test("예외 테스트: 숫자 없음", async () => {
    const inputs = ["//;\\n"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

  test("예외 테스트: 입력값 없음", async () => {
    const inputs = [""];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });


  test("예외 테스트: \\n 누락", async () => {
    const inputs = ["//;1;2;3"];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

});
