import{_}from"./ValaxyMain.vue_vue_type_style_index_0_lang-fe251ba5.js";import{_ as d,u as m,p as E,c as y,w as l,o as u,a as s,b as e,d as p,r as t,e as f}from"./app-26811a30.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-7077ea1d.js";import"./YunCard.vue_vue_type_script_setup_true_lang-4fd0a032.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-4a847a42.js";import"./index-463abdac.js";const B=JSON.parse('{"title":"MySql批量修改表和表内字段的字符集和排序规则","description":"","frontmatter":{"title":"MySql批量修改表和表内字段的字符集和排序规则","categories":["学习笔记"],"tags":["MySql","数据库","Sql"],"date":"2020-07-22T18:28:35.000Z"},"headers":[],"relativePath":"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","path":"/home/runner/work/blog/blog/pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","lastUpdated":1729051324000}'),o=JSON.parse('{"title":"MySql批量修改表和表内字段的字符集和排序规则","description":"","frontmatter":{"title":"MySql批量修改表和表内字段的字符集和排序规则","categories":["学习笔记"],"tags":["MySql","数据库","Sql"],"date":"2020-07-22T18:28:35.000Z"},"headers":[],"relativePath":"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","path":"/home/runner/work/blog/blog/pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md","lastUpdated":1729051324000}'),A={name:"pages/posts/2020-07-22-bulk_modification_of_table_and_field_character_set_and_sorting_rules_in_mysql.md",data(){return{data:o,frontmatter:o.frontmatter,$frontmatter:o.frontmatter}},setup(){const a=m();a.meta.frontmatter=Object.assign(a.meta.frontmatter,o.frontmatter),E("pageData",o)}},T={id:"批量修改字段",tabindex:"-1"},L={id:"批量修改表",tabindex:"-1"};function C(a,n,N,b,i,S){const r=f,c=_;return u(),y(c,{frontmatter:i.frontmatter,data:i.data},{"main-content-md":l(()=>[n[4]||(n[4]=s("p",null,"在将测试库的新增表通过Navicat向阿里云的MySql数据库复制后，发现前端页面请求查询失败。",-1)),n[5]||(n[5]=s("p",null,[e("目标数据库的默认排序规则是"),s("code",null,"utf8mb4_0900_ai_ci"),e("，已存在的表都使用了这个编码，而来源数据库的排序规则是"),s("code",null,"utf8mb4_unicode_ci"),e("，新复制的表都用的是后者。")],-1)),n[6]||(n[6]=s("p",null,"数据库进行多表关联查询时，如果两张表的字符集或者排序规则不一致，就会报错。",-1)),n[7]||(n[7]=s("p",null,"从Navicat里手动修改编码效率很低，若只是改一下表，也用不了多久，但问题是只改表是不行的，表内所有varchar的编码并不会跟着表走。",-1)),n[8]||(n[8]=s("p",null,"因此还是需要走批量操作的路子。",-1)),s("h4",T,[n[1]||(n[1]=e("批量修改字段 ")),p(r,{class:"header-anchor",href:"#批量修改字段","aria-hidden":"true"},{default:l(()=>n[0]||(n[0]=[e("#")])),_:1})]),n[9]||(n[9]=s("div",{class:"language-mysql"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"SELECT")]),e(`
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
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	OR DATA_TYPE = 'char')")])])])],-1)),s("h4",L,[n[3]||(n[3]=e("批量修改表 ")),p(r,{class:"header-anchor",href:"#批量修改表","aria-hidden":"true"},{default:l(()=>n[2]||(n[2]=[e("#")])),_:1})]),n[10]||(n[10]=s("div",{class:"language-mysql"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki github-dark vp-code-dark"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	CONCAT( 'ALTER TABLE ', TABLE_NAME, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' ) ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	information_schema.TABLES ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#e1e4e8"}},"	TABLE_SCHEMA = '数据库名';")])])]),s("pre",{class:"shiki github-light vp-code-light"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"SELECT")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	CONCAT( 'ALTER TABLE ', TABLE_NAME, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' ) ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"FROM")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	information_schema.TABLES ")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"WHERE")]),e(`
`),s("span",{class:"line"},[s("span",{style:{color:"#24292e"}},"	TABLE_SCHEMA = '数据库名';")])])])],-1)),n[11]||(n[11]=s("p",null,[e("将以上SQL语句中的"),s("code",null,"utf8mb4"),e("、"),s("code",null,"utf8mb4_unicode_ci"),e("、"),s("code",null,"数据库名"),e("分别改成自己需要的值，成功执行后，将执行结果即SQL语句复制出来，再执行这些SQL语句即可。")],-1))]),"main-header":l(()=>[t(a.$slots,"main-header")]),"main-header-after":l(()=>[t(a.$slots,"main-header-after")]),"main-nav":l(()=>[t(a.$slots,"main-nav")]),"main-content":l(()=>[t(a.$slots,"main-content")]),"main-content-after":l(()=>[t(a.$slots,"main-content-after")]),"main-nav-before":l(()=>[t(a.$slots,"main-nav-before")]),"main-nav-after":l(()=>[t(a.$slots,"main-nav-after")]),comment:l(()=>[t(a.$slots,"comment")]),footer:l(()=>[t(a.$slots,"footer")]),aside:l(()=>[t(a.$slots,"aside")]),"aside-custom":l(()=>[t(a.$slots,"aside-custom")]),default:l(()=>[t(a.$slots,"default")]),_:3},8,["frontmatter","data"])}const H=d(A,[["render",C]]);export{B as __pageData,H as default};
