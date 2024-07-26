/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  propEq,
  allPass,
  equals,
  prop,
  complement,
  curry,
  filter,
  values,
  anyPass,
} from "ramda";

// Предикаты

// Проверка, что два свойства в объекте равны
const haveSameColor = (key1, key2) => (obj) =>
  equals(prop(key1, obj), prop(key2, obj));

// Проверка, что треугольник и квадрат одного цвета
const isTriangleHasTheSameColorWithSquare = haveSameColor("square", "triangle");

// Функция для фильтрации фигур по цвету и подсчета их количества
const countColorShapes = curry(
  (color, shapes) => filter(equals(color), values(shapes)).length
);

// Функция для проверки, что количество фигур с определенным цветом больше или равно указанному числу
const hasAtLeastNColorShapes = curry(
  (n, color, shapes) => countColorShapes(color, shapes) >= n
);

// Функция для проверки, что количество фигур с определенным цветом равно указанному числу
const hasExactlyNColorShapes = curry(
  (n, color, shapes) => countColorShapes(color, shapes) === n
);

// Специализированная функция для проверки, что количество фигур определенного цвета больше или равно 3
const hasAtLeast3ColorShapes = hasAtLeastNColorShapes(3);
const hasAtLeast2ColorShapes = hasAtLeastNColorShapes(2);

// Специализированная функция для проверки, что количество фигур определенного цвета равно 2
const hasExactly2ColorShapes = hasExactlyNColorShapes(2);
const hasExactly1ColorShapes = hasExactlyNColorShapes(1);

// Частично примененные функции для проверки на наличие по крайней мере трех фигур каждого цвета
const hasAtLeast3GreenShapes = hasAtLeast3ColorShapes("green");
const hasAtLeast3OrangeShapes = hasAtLeast3ColorShapes("orange");
const hasAtLeast3BlueShapes = hasAtLeast3ColorShapes("blue");
const hasAtLeast3RedShapes = hasAtLeast3ColorShapes("red");

// Частично примененные функции для проверки на наличие по крайней ровно двух фигур определённого цвета
const hasExactly2GreenShapes = hasExactly2ColorShapes("green");
const hasExactly1RedShapes = hasExactly1ColorShapes("red");

// Проверка, что количество фигур одного цвета равно количеству фигур другого цвета
const hasEqualColorShapes = curry(
  (color1, color2, shapes) =>
    countColorShapes(color1, shapes) === countColorShapes(color2, shapes)
);

// звёзды
const isRedStar = propEq("star", "red");
const isOrangeStar = propEq("star", "orange");
const isGreenStar = propEq("star", "green");
const isWhiteStar = propEq("star", "white");
const isNotWhiteStar = complement(isWhiteStar);
const isNotRedStar = complement(isRedStar);

// прямоугольники
const isGreenSquare = propEq("square", "green");
const isOrangeSquare = propEq("square", "orange");
const isWhiteSquare = propEq("square", "white");
const isNotWhiteSquare = complement(isWhiteSquare);

// треугольники
const isWhiteTriangle = propEq("triangle", "white");
const isOrangeTriangle = propEq("triangle", "orange");
const isGreenTriangle = propEq("triangle", "green");
const isNotWhiteTriangle = complement(isWhiteTriangle);

// круги
const isWhiteCircle = propEq("circle", "white");
const isOrangeCircle = propEq("circle", "orange");
const isGreenCircle = propEq("circle", "green");
const isBlueCircle = propEq("circle", "blue");

// allPass
const validateFirstField = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteTriangle,
  isWhiteCircle,
]);

const validateSecondField = hasAtLeast2ColorShapes("green");

const validateThirdField = hasEqualColorShapes("red", "blue");

const validateFourthField = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

const validateFifthField = anyPass([
  hasAtLeast3GreenShapes,
  hasAtLeast3OrangeShapes,
  hasAtLeast3BlueShapes,
  hasAtLeast3RedShapes,
]);

const validateSixthField = allPass([
  isGreenTriangle,
  hasExactly2GreenShapes,
  hasExactly1RedShapes,
]);

const validateSeventhField = allPass([
  isOrangeStar,
  isOrangeSquare,
  isOrangeTriangle,
  isOrangeCircle,
]);

const validateEigthField = allPass([isNotWhiteStar, isNotRedStar]);

const validateNinthField = allPass([
  isGreenStar,
  isGreenSquare,
  isGreenTriangle,
  isGreenCircle,
]);

const validateTenthField = allPass([
  isNotWhiteTriangle,
  isNotWhiteSquare,
  isTriangleHasTheSameColorWithSquare,
]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
  return validateFirstField(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
  return validateSecondField(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
  return validateThirdField(shapes);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
  return validateFourthField(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
  return validateFifthField(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
  return validateSixthField(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
  return validateSeventhField(shapes);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => {
  return validateEigthField(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
  return validateNinthField(shapes);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
  return validateTenthField(shapes);
};
