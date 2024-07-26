/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import { pipe, allPass } from "ramda";

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // Логирование начального значения
  writeLog(value);

  // Отдельные функции для проверок
  const isValidLength = (str) => str.length < 10 && str.length > 2;
  const isPositive = (str) => parseFloat(str) > 0;
  const isNumber = (str) => /^[0-9]+(\.[0-9]+)?$/.test(str);

  // Комплексная функция валидации, объединяющая все проверки
  const validate = (str) => {
    if (!allPass([isValidLength, isPositive, isNumber])(str)) {
      throw new Error("ValidationError");
    }
    return str;
  };

  // Функция для округления числа и логирования
  const roundAndLog = pipe(parseFloat, Math.round, (num) => {
    writeLog(num);
    return num;
  });

  // Функция для перевода числа в двоичную систему с использованием API
  const toBinary = (num) =>
    api
      .get("https://api.tech/numbers/base")({
        from: 10,
        to: 2,
        number: num.toString(),
      })
      .then(({ result }) => {
        writeLog(result);
        return result;
      });

  // Функция для логирования длины строки
  const logLength = (str) => {
    const length = str.length;
    writeLog(length);
    return length;
  };

  // Функция для возведения в квадрат и логирования
  const squareAndLog = (num) => {
    const squared = num * num;
    writeLog(squared);
    return squared;
  };

  // Функция для вычисления остатка от деления на 3 и логирования
  const mod3AndLog = (num) => {
    const mod = num % 3;
    writeLog(mod);
    return mod;
  };

  // Функция для получения имени животного по ID
  const fetchAnimal = (id) =>
    api
      .get(`https://animals.tech/${id}`)({})
      .then(({ result }) => {
        handleSuccess(result);
      });

  // Цепочка обработки данных
  Promise.resolve(value)
    .then(validate)
    .then(roundAndLog)
    .then(toBinary)
    .then(logLength)
    .then(squareAndLog)
    .then(mod3AndLog)
    .then(fetchAnimal)
    .catch((error) => {
      if (error.message === "ValidationError") {
        handleError("ValidationError");
      } else {
        handleError(error.message);
      }
    });
};

export default processSequence;
