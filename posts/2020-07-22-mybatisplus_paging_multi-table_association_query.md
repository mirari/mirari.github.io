---
title: MyBatisPlus分页多表关联查询
categories:
  - 学习笔记
tags:
  - Java
  - MyBatis
  - Sql
date: '2020-07-22 18:33:00'
---

`BaseMapper`提供的默认查询方法都是单表的，如果需要多表关联查询，同时还要支持分页，一个方案就是自己写Sql。

现在自己写Sql一般用的应该不是传统MyBatis那种写xml的老方法，而是通过在Mapper类里写注解来实现。

还需要解决的就是如何在自定义Sql语句中拼接MyBatisPlus的分页参数和查询条件。

示例如下：

```java
public interface GameQueryMapper extends BaseMapper<GameQuery> {
    String querySql = "SELECT a.*, b.org_id FROM t_game AS a LEFT JOIN t_game_game_org AS b ON b.game_id = a.id ";
    String wrapperSql = "SELECT * from ( " + querySql + " ) AS q ${ew.customSqlSegment}";
    /**
     * 分页查询
     */
    @Select(wrapperSql)
    Page<GameQuery> page(Page page, @Param("ew") Wrapper queryWrapper);

    /**
     * 普通查询
     */
    @Select(wrapperSql)
    List<GameQuery> list(@Param("ew") Wrapper queryWrapper);

    /**
     * 单独查询
     */
    @Select(wrapperSql)
    QyyOrgQuery one(@Param("ew") Wrapper queryWrapper);
}
```

关键在于Sql字符串最后那一句`${ew.customSqlSegment}`，是用来拼接LambdaQueryWrapper等查询条件包裹器对象最终输出的Sql语句的。

前面不能有WHERE，所以我在最外面又包了一层，将纯粹的多表关联查询语句与特殊组装语句区分开，这样不但可以在自定义Sql内部使用WHERE语句，也便于复制和创建新的Mapper。

但这里还要注意一个关键问题。

在Mapper里面自定义Sql注解对应的方法，其返回的Pojo对象，以及Mapper类指定的Pojo对象，他们必须完全一致。

即：`extends BaseMapper<T>` 中的T需要与`Page<T>`一致

如果我在`public interface GameMapper extends BaseMapper<Game>`里写了这样一个方法：

```java
Page<GameQuery> page(Page page, @Param("ew") Wrapper queryWrapper);
```
即使`GameQuery`这个对应多表关联字段的Pojo继承自`Game`,也会出现如下错误：

```
evaluating expression 'ew.customSqlSegment'. Cause: org.apache.ibatis.ognl.OgnlException: customSqlSegment [com.baomidou.mybatisplus.core.exceptions.MybatisPlusException: can not find lambda cache for this entity
```

因此，多表关联分页查询的Mapper需要单独新建，与单表实例分开。
