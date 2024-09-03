import{_ as p}from"./ValaxyMain.vue_vue_type_style_index_0_lang-03c2f3c7.js";import{_,u as d,p as m,c as E,w as n,o as y,a as s,b as e,d as i,r as l,e as u}from"./app-a4aa86ae.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-7b91ae55.js";import"./YunCard.vue_vue_type_script_setup_true_lang-7f8703c9.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-26506e1e.js";import"./index-463abdac.js";const Y=JSON.parse('{"title":"MySql批量修改表和表内字段的字符集和排序规则","description":"","frontmatter":{"title":"MySql批量修改表和表内字段的字符集和排序规则","categories":["学习笔记"],"tags":["MySql","数据库","Sql"],"date":"2020-07-22T18:28:35.000Z"},"headers":[],"relativePath":"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","path":"/home/runner/work/blog/blog/pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","lastUpdated":1725349805000}'),t=JSON.parse('{"title":"MySql批量修改表和表内字段的字符集和排序规则","description":"","frontmatter":{"title":"MySql批量修改表和表内字段的字符集和排序规则","categories":["学习笔记"],"tags":["MySql","数据库","Sql"],"date":"2020-07-22T18:28:35.000Z"},"headers":[],"relativePath":"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","path":"/home/runner/work/blog/blog/pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","lastUpdated":1725349805000}'),f={name:"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md",data(){return{data:t,frontmatter:t.frontmatter,$frontmatter:t.frontmatter}},setup(){const a=d();a.meta.frontmatter=Object.assign(a.meta.frontmatter,t.frontmatter),m("pageData",t)}},A=s("p",null,"在将测试库的新增表通过Navicat向阿里云的MySql数据库复制后，发现前端页面请求查询失败。",-1),T=s("p",null,[e("目标数据库的默认排序规则是"),s("code",null,"utf8mb4_0900_ai_ci"),e("，已存在的表都使用了这个编码，而来源数据库的排序规则是"),s("code",null,"utf8mb4_unicode_ci"),e("，新复制的表都用的是后者。")],-1),h=s("p",null,"数据库进行多表关联查询时，如果两张表的字符集或者排序规则不一致，就会报错。",-1),L=s("p",null,"从Navicat里手动修改编码效率很低，若只是改一下表，也用不了多久，但问题是只改表是不行的，表内所有varchar的编码并不会跟着表走。",-1),C=s("p",null,"因此还是需要走批量操作的路子。",-1),N={id:"批量修改字段",tabindex:"-1"},b=s("div",{class:"language-mysql"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	CONCAT(")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		'ALTER TABLE `',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		TABLE_NAME,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		'` MODIFY `',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		COLUMN_NAME,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		'` ',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		DATA_TYPE,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		'(',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		CHARACTER_MAXIMUM_LENGTH,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		( CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE '' END ),")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"		';' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},") ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	information_schema.COLUMNS ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	TABLE_SCHEMA = '数据库名' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	AND (")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	DATA_TYPE = 'varchar' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	OR DATA_TYPE = 'char')")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	CONCAT(")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		'ALTER TABLE `',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		TABLE_NAME,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		'` MODIFY `',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		COLUMN_NAME,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		'` ',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		DATA_TYPE,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		'(',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		CHARACTER_MAXIMUM_LENGTH,")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		( CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE '' END ),")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"		';' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},") ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	information_schema.COLUMNS ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	TABLE_SCHEMA = '数据库名' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	AND (")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	DATA_TYPE = 'varchar' ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	OR DATA_TYPE = 'char')")])])])],-1),S={id:"批量修改表",tabindex:"-1"},g=s("div",{class:"language-mysql"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	CONCAT( 'ALTER TABLE ', TABLE_NAME, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' ) ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	information_schema.TABLES ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	TABLE_SCHEMA = '数据库名';")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	CONCAT( 'ALTER TABLE ', TABLE_NAME, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' ) ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	information_schema.TABLES ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	TABLE_SCHEMA = '数据库名';")])])])],-1),M=s("p",null,[e("将以上SQL语句中的"),s("code",null,"utf8mb4"),e("、"),s("code",null,"utf8mb4_unicode_ci"),e("、"),s("code",null,"数据库名"),e("分别改成自己需要的值，成功执行后，将执行结果即SQL语句复制出来，再执行这些SQL语句即可。")],-1);function O(a,R,v,B,o,H){const c=u,r=p;return y(),E(r,{frontmatter:o.frontmatter,data:o.data},{"main-content-md":n(()=>[A,T,h,L,C,s("h4",N,[e("批量修改字段 "),i(c,{class:"header-anchor",href:"#批量修改字段","aria-hidden":"true"},{default:n(()=>[e("#")]),_:1})]),b,s("h4",S,[e("批量修改表 "),i(c,{class:"header-anchor",href:"#批量修改表","aria-hidden":"true"},{default:n(()=>[e("#")]),_:1})]),g,M]),"main-header":n(()=>[l(a.$slots,"main-header")]),"main-header-after":n(()=>[l(a.$slots,"main-header-after")]),"main-nav":n(()=>[l(a.$slots,"main-nav")]),"main-content":n(()=>[l(a.$slots,"main-content")]),"main-content-after":n(()=>[l(a.$slots,"main-content-after")]),"main-nav-before":n(()=>[l(a.$slots,"main-nav-before")]),"main-nav-after":n(()=>[l(a.$slots,"main-nav-after")]),comment:n(()=>[l(a.$slots,"comment")]),footer:n(()=>[l(a.$slots,"footer")]),aside:n(()=>[l(a.$slots,"aside")]),"aside-custom":n(()=>[l(a.$slots,"aside-custom")]),default:n(()=>[l(a.$slots,"default")]),_:3},8,["frontmatter","data"])}const F=_(f,[["render",O]]);export{Y as __pageData,F as default};
