import { Button } from "antd";
import * as XLSX from "xlsx"; // 1. 引入xlsx库
import { stuBatch } from "../../api/user";

export default function ImportExcel() {
  const importExcel = () => {
    console.log("input触发事件函数,获取excel文件并解析");
    const file = (document.getElementById("fileRef") as HTMLInputElement)
      .files![0]; //4. 获取input拿到的excel文件对象
    const reader = new FileReader();
    reader.readAsBinaryString(file); // 转成 二进制格式
    reader.onload = function () {
      const workbook = XLSX.read(this.result, { type: "binary" });
      const t = workbook.Sheets["学员登记表"]; // 【！注意！】拿到表格数据,需要跟表格文件内部的表名一致
      // console.log(t)
      const r: any = XLSX.utils.sheet_to_json(t); // 5-1. excel数据转换成json格式
      //   console.log(r)
      //   setBanner(r);
      // 将r的数据上传至服务器
      console.log("json数据", r);
      stuBatch(r); // api上传

      //5-2，excel数据转为html
      var container = document.getElementById("cont");
      (container as HTMLDivElement).innerHTML = XLSX.utils.sheet_to_html(t);
      //   console.log("html数据", XLSX.utils.sheet_to_html(t));
    };
  };
  return (
    <div>
      <Button
        onClick={() => {
          // 2. 触发input文件选择器
          (document.getElementById("fileRef") as HTMLInputElement).click();
        }}
      >
        导入Excel数据
      </Button>
      {/* 3.  input文件的选择，触发excel文件解析函数*/}
      <input type="file" hidden id="fileRef" onChange={importExcel} />
      <div id="cont"></div>
    </div>
  );
}
