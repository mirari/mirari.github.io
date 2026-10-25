---
title: MySql批量修改表和表内字段的字符集和排序规则
categories:
  - 学习笔记
tags:
  - MySql
  - 数据库
  - Sql
date: '2020-07-22 18:28:35'
---

在将测试库的新增表通过Navicat向阿里云的MySql数据库复制后，发现前端页面请求查询失败。

目标数据库的默认排序规则是`utf8mb4_0900_ai_ci`，已存在的表都使用了这个编码，而来源数据库的排序规则是`utf8mb4_unicode_ci`，新复制的表都用的是后者。

数据库进行多表关联查询时，如果两张表的字符集或者排序规则不一致，就会报错。

从Navicat里手动修改编码效率很低，若只是改一下表，也用不了多久，但问题是只改表是不行的，表内所有varchar的编码并不会跟着表走。

因此还是需要走批量操作的路子。

#### 批量修改字段

```sql
SELECT
	CONCAT(
		'ALTER TABLE `',
		TABLE_NAME,
		'` MODIFY `',
		COLUMN_NAME,
		'` ',
		DATA_TYPE,
		'(',
		CHARACTER_MAXIMUM_LENGTH,
		') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
		( CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE '' END ),
		';'
)
FROM
	information_schema.COLUMNS
WHERE
	TABLE_SCHEMA = '数据库名'
	AND (
	DATA_TYPE = 'varchar'
	OR DATA_TYPE = 'char')
```

#### 批量修改表

```sql
SELECT
	CONCAT( 'ALTER TABLE ', TABLE_NAME, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' )
FROM
	information_schema.TABLES
WHERE
	TABLE_SCHEMA = '数据库名';
```

将以上SQL语句中的`utf8mb4`、`utf8mb4_unicode_ci`、`数据库名`分别改成自己需要的值，成功执行后，将执行结果即SQL语句复制出来，再执行这些SQL语句即可。
