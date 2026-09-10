const PARTS = [
  { id: 1, name: '为什么你总是懒得做饭',     range: '01-03' },
  { id: 2, name: '建立你的周末备菜系统',     range: '04-07' },
  { id: 3, name: '工作日 15 分钟做饭系统',   range: '08-10' },
  { id: 4, name: '让快手饭真正健康',         range: '11-12' },
  { id: 5, name: '真正开始吃起来',           range: '13-14' },
  { id: 6, name: '附录 · 工具箱',            range: '15-20' },
];

const CHAPTERS = [
  { id: '01', part: 1, file: '01_dinner_system_problem.md',       title: '你不是懒，是晚餐系统出了问题' },
  { id: '02', part: 1, file: '02_find_your_meal_prep_style.md',   title: '先别学做菜：找到你的备菜流派' },
  { id: '03', part: 1, file: '03_kitchen_efficiency_checkup.md',  title: '给你的厨房做一次"效率体检"' },
  { id: '04', part: 2, file: '04_one_time_shopping_for_week.md',  title: '一次采购，解决一周吃什么' },
  { id: '05', part: 2, file: '05_ingredient_modularization.md',   title: '食材模块化：把肉、菜、主食变成半成品' },
  { id: '06', part: 2, file: '06_sauce_modularization.md',        title: '调味模块化：5 瓶酱解决 80% 的晚餐' },
  { id: '07', part: 2, file: '07_weekend_3h_prep_sop.md',         title: '周末 3 小时备菜 SOP' },
  { id: '08', part: 3, file: '08_four_quick_cooking_methods.md',  title: '四种快手烹饪法' },
  { id: '09', part: 3, file: '09_fridge_to_table_15min.md',       title: '从冰箱到餐桌：15 分钟晚餐工作流' },
  { id: '10', part: 3, file: '10_one_pot_less_dishes.md',         title: '一锅出与少洗碗系统' },
  { id: '11', part: 4, file: '11_nutrition_without_calories.md',  title: '不算卡路里的营养搭配法' },
  { id: '12', part: 4, file: '12_freeze_thaw_reheat_safety.md',   title: '冷冻、解冻、复热与食品安全' },
  { id: '13', part: 5, file: '13_30days_quick_kitchen.md',        title: '30 天建立你的快手厨房' },
  { id: '14', part: 5, file: '14_build_your_own_menu_system.md',  title: '你需要的是自己的菜单系统' },
  { id: '15', part: 6, file: 'appendix_a_kitchen_efficiency_test.md',   title: '附录 A · 厨房效率测试表' },
  { id: '16', part: 6, file: 'appendix_b_weekly_shopping_list.md',      title: '附录 B · 一周采购清单' },
  { id: '17', part: 6, file: 'appendix_c_weekend_3hour_checklist.md',   title: '附录 C · 周末 3 小时备菜 Checklist' },
  { id: '18', part: 6, file: 'appendix_d_freezer_label_template.md',    title: '附录 D · 冷冻标签模板与库存管理' },
  { id: '19', part: 6, file: 'appendix_e_universal_sauce_cards.md',     title: '附录 E · 万能酱卡与调料选购指南' },
  { id: '20', part: 6, file: 'appendix_f_50_quick_recipes.md',          title: '附录 F · 50 道 15 分钟菜谱与工具矩阵' },
];

window.PARTS = PARTS;
window.CHAPTERS = CHAPTERS;