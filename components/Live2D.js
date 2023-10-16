/* eslint-disable no-undef */
import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

export default function Live2D() {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0)

  React.useEffect(() => {
    if (BLOG.WIDGET_PET) {
      window.addEventListener('scroll', initLive2D)
      return () => {
        window.removeEventListener('scroll', initLive2D)
      }
    }
  }, [])


  if (!BLOG.WIDGET_PET || !JSON.parse(BLOG.WIDGET_PET)) {
    return <></>
  }

  return <canvas
    id="live2d"
    width="900"
    height="900"
    onClick={handleClick}
    className="cursor-grab"
    onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
    onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')}
    style={{
      width: '300px', // 设置Canvas的CSS宽度
      height: '300px' // 设置Canvas的CSS高度
    }}
  />
}

/**
 * 加载宠物
 */
function initLive2D() {
  window.removeEventListener('scroll', initLive2D)
  setTimeout(() => {
    // 加载 waifu.css live2d.min.js waifu-tips.js
    // if (screen.width >= 768) {
    Promise.all([
      // loadExternalResource('https://cdn.zhangxinxu.com/sp/demo/live2d/live2d/js/live2d.js', 'js')
      loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js'),
      fetch('https://xxx.tgftgf.workers.dev/100100/pose.json') // 获取远程 pose.json 文件
        .then(response => response.json()) // 解析 JSON 响应
        .then(poseData => {
          // poseData 包含从远程 pose.json 文件获取的数据
          // 在这里处理 poseData，可能需要将其存储在状态中
        }
        ),
      fetch('https://xxx.tgftgf.workers.dev/100100/physics.json') // 获取远程 pose.json文件
        .then(response => response.json()) // 解析 JSON 响应
        .then(physicsData => {
          // poseData 包含从远程 pose.json 文件获取的数据
          // 在这里处理 poseData，可能需要将其存储在状态中
        })
    ]).then((e) => {
      // https://github.com/xiazeyu/live2d-widget-models
      loadlive2d('live2d', BLOG.WIDGET_PET_LINK)
    })
    // }
  }, 300)
}
function applyPose(poseIndex) {
  const selectedPose = poseData[poseIndex]
  // 在这里使用Live2D库的函数来应用姿势
  // 示例：假设使用setPose函数来应用姿势
  setPose(selectedPose)

  // 如果有物理特性的数据，也可以应用
  if (physicsData) {
    // 在这里使用Live2D库的函数来应用物理特性
    // 示例：假设使用setPhysics函数来应用物理特性
    setPhysics(physicsData)
  }
}

// 处理点击事件，切换到下一个姿势
function handleClick() {
  const nextPoseIndex = (currentPoseIndex + 1) % poseData.length
  applyPose(nextPoseIndex)
  setCurrentPoseIndex(nextPoseIndex)
}