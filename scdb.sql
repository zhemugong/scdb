/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50559
Source Host           : localhost:3306
Source Database       : scdb

Target Server Type    : MYSQL
Target Server Version : 50559
File Encoding         : 65001

Date: 2020-10-11 17:52:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `course`
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `cno` char(12) NOT NULL,
  `cname` varchar(50) NOT NULL,
  `cpno` char(12) DEFAULT NULL,
  `ccredit` float(2,1) NOT NULL,
  PRIMARY KEY (`cno`),
  KEY `fk_course_cpno` (`cpno`),
  CONSTRAINT `fk_course_cpno` FOREIGN KEY (`cpno`) REFERENCES `course` (`cno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('22', '数据结构', null, '1.0');
INSERT INTO `course` VALUES ('33', 'vue', null, '3.0');
INSERT INTO `course` VALUES ('88', '小程序', null, '2.0');

-- ----------------------------
-- Table structure for `department`
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dno` varchar(30) NOT NULL,
  `dname` varchar(30) NOT NULL,
  `dmanager` char(8) NOT NULL,
  PRIMARY KEY (`dno`),
  KEY `fk_department_manage` (`dmanager`),
  KEY `dname` (`dname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES ('11122233', '信息技术学院', '罗志聪');
INSERT INTO `department` VALUES ('222', '计算机学院', '罗志聪');
INSERT INTO `department` VALUES ('456', '艺术学院', '刘欢');
INSERT INTO `department` VALUES ('789', '音乐学院', '周杰伦');

-- ----------------------------
-- Table structure for `sct`
-- ----------------------------
DROP TABLE IF EXISTS `sct`;
CREATE TABLE `sct` (
  `sno` char(12) NOT NULL,
  `cno` char(12) NOT NULL,
  `tno` char(8) NOT NULL,
  `grade` float(4,1) DEFAULT '0.0',
  PRIMARY KEY (`sno`,`cno`,`tno`),
  KEY `fk_sct_course` (`cno`),
  KEY `fk_sct_teacher` (`tno`),
  CONSTRAINT `fk_sct_course` FOREIGN KEY (`cno`) REFERENCES `course` (`cno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sct_stu` FOREIGN KEY (`sno`) REFERENCES `student` (`sno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sct_teacher` FOREIGN KEY (`tno`) REFERENCES `teacher` (`tno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sct
-- ----------------------------
INSERT INTO `sct` VALUES ('201824111258', '22', '456', '0.0');
INSERT INTO `sct` VALUES ('201824111258', '33', '11223355', '0.0');
INSERT INTO `sct` VALUES ('201824111258', '88', '11223355', '0.0');
INSERT INTO `sct` VALUES ('201824111259', '33', '11223355', '0.0');
INSERT INTO `sct` VALUES ('201824111260', '33', '11223355', '0.0');
INSERT INTO `sct` VALUES ('201824111260', '88', '11223355', '0.0');

-- ----------------------------
-- Table structure for `student`
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `sno` char(12) NOT NULL,
  `spassword` varchar(25) NOT NULL,
  `sname` varchar(8) NOT NULL,
  `ssex` char(1) NOT NULL,
  `sage` int(4) NOT NULL,
  `sdept` varchar(30) NOT NULL,
  `sid` varchar(18) NOT NULL,
  `power` varchar(5) NOT NULL,
  PRIMARY KEY (`sno`),
  KEY `fk_department_stu` (`sdept`),
  CONSTRAINT `fk_department_stu` FOREIGN KEY (`sdept`) REFERENCES `department` (`dname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('201824111218', '12345', '张三', '男', '20', '计算机学院', '445222199803201011', '普通学生');
INSERT INTO `student` VALUES ('201824111219', '12345', '李四', '女', '20', '计算机学院', '445222199803201012', '普通学生');
INSERT INTO `student` VALUES ('201824111244', '12345', '思思', '女', '22', '艺术学院', '445222199803201014', '普通学生');
INSERT INTO `student` VALUES ('201824111255', '12345', '五五', '女', '22', '艺术学院', '445222199803201014', '普通学生');
INSERT INTO `student` VALUES ('201824111258', '12345', '钟文坚', '男', '20', '计算机学院', '445222199803201014', '普通学生');
INSERT INTO `student` VALUES ('201824111259', '12345', '姜春景', '男', '21', '信息技术学院', '445222199903201014', '普通学生');
INSERT INTO `student` VALUES ('201824111260', '12345', '刘文鑫', '男', '23', '计算机学院', '445222199803201014', '学生管理员');
INSERT INTO `student` VALUES ('201824111261', '12345', '章涪钧', '男', '23', '计算机学院', '445222199703201014', '普通学生');

-- ----------------------------
-- Table structure for `teacher`
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `tno` char(8) NOT NULL,
  `tname` varchar(8) NOT NULL,
  `tsex` char(1) NOT NULL,
  `tage` int(4) NOT NULL,
  `teb` varchar(10) NOT NULL,
  `tpt` varchar(10) NOT NULL,
  `cno1` char(12) DEFAULT NULL,
  `cno2` char(12) DEFAULT NULL,
  `cno3` char(12) DEFAULT NULL,
  PRIMARY KEY (`tno`),
  KEY `fk_teacher_course1` (`cno1`),
  KEY `fk_teacher_course2` (`cno2`),
  KEY `fk_teacher_course3` (`cno3`),
  CONSTRAINT `fk_teacher_course1` FOREIGN KEY (`cno1`) REFERENCES `course` (`cno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_course2` FOREIGN KEY (`cno2`) REFERENCES `course` (`cno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_course3` FOREIGN KEY (`cno3`) REFERENCES `course` (`cno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('11223355', '温馨', '男', '20', '学士', '助教', '88', '33', null);
INSERT INTO `teacher` VALUES ('456', '张婵', '女', '40', '硕士', '副教授', '22', null, null);
