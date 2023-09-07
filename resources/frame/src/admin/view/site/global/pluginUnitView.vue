<template>
  <div class="plugin-unit">
    <Card>
      <p class="plugin-unit-file"><a href="https://developer.discuz.chat/#/plugin/start" target="_blank">插件文档</a></p>
      <el-upload
        class="upload-demo"
        action
        :http-request="uploaderPlugin"
        :on-change="handleChange"
        :before-upload="beforePluginUpload">
        <el-button size="small" type="primary">上传插件</el-button>
      </el-upload>
      <!-- <el-button type="primary" size="medium" @click="determineBtn('upload', '')"
        >上传插件</el-button> -->
    </Card>
    <Card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="ID">
          <template slot-scope="scope">
            <span>{{ scope.row.app_id}}</span>
          </template>
        </el-table-column>

        <el-table-column label="英文/中文">
          <template slot-scope="scope">
            <span>{{ scope.row.name_en }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <p>{{ scope.row.status === 1  ? '已发布' : '未发布'}}</p>
          </template>
        </el-table-column>

        <el-table-column label="类型">
          <template slot-scope="scope">
            <p>{{ typeConversion(scope.row.type) }}</p>
          </template>
        </el-table-column>

        <!-- <el-table-column label="所属权限">
          <template slot-scope="scope">
            <p>{{ scope.row.name_en }}</p>
          </template>
        </el-table-column> -->

        <el-table-column label="操作"  class="plugin-unit-post">
          <template slot-scope="scope">
            <div class="plugin-unit-post__box">
              <!-- <span class="plugin-unit-post__box-text" @click="determineBtn('details', scope)">查看详情</span> -->
              <span class="plugin-unit-post__box-text" v-if="scope.row.status === 0" @click="plugInRelease(scope.row.app_id, 1)">发布</span>
              <span class="plugin-unit-post__box-text" v-if="scope.row.status === 1" @click="plugInRelease(scope.row.app_id, 2)">下线</span>
              <span class="plugin-unit-post__box-detal" @click="plugInRelease(scope.row.app_id, 3)">删除</span>
              <!-- <span class="plugin-unit-post__box-text">编辑</span> -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="40%"
          height="40%"
          :append-to-body="true"
          :lock-scroll="false"
          class="plugin-unit-post__box-dialog"
          >
            <div class="plugin-unit-post__box-upload" v-if="uploadType ==='upload'">
              <p class="plugin-unit-post__box-upload-file">
                <span class="plugin-unit-post__box-upload-file__left">插件上传:</span>
                <el-upload
                  class="upload-demo"
                  action
                  :http-request="uploaderPlugin"
                  :on-change="handleChange"
                  :before-upload="beforePluginUpload"
                  :file-list="fileList">
                  <el-button size="small" type="primary">选择文件</el-button>
                </el-upload>
              </p>
            </div>
            <div class="plugin-unit-post__box-upload" v-if="uploadType ==='details'">
              <div class="plugin-unit-post__box-upload-name">
                <span class="plugin-unit-post__box-upload-name__left">插件名称:</span>
                <p
                  class="plugin-unit-post__box-upload-name__right"
                  style="height: 36PX;width: 200PX"
                >
                 {{uploadDetails.name}}
                </p>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog> -->
      </el-table>
    </Card>
  </div>
</template>

<script>
import "../../../scss/site/module/globalStyle.scss";
import otherServiceContentCon from "../../../controllers/site/global/pluginUnitCon";
export default {
  name: "other-service-content",
  ...otherServiceContentCon,
};
</script>