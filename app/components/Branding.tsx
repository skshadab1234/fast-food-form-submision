'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { List } from 'lucide-react'

const Branding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='flex flex-col justify-center items-center mb-10 space-y-2'>
      <Image src='/mamujaan.png' alt='Logo' width={200} height={200} />
      <h1 className='text-xs font-bold text-center'>Fast Food Corner</h1>
      {/* View Menu Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='bg-red-500 text-white p-2  text-xs font-bold rounded hover:bg-red-600 tracking-wide flex items-center gap-2'
      >
        <List width={20} height={20} /> View Menu
      </button>
      {/* Modal with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-white rounded-lg p-4 max-w-md relative'
              initial={{ rotateY: -90, scale: 0 }}
              animate={{ rotateY: 0, scale: 1 }}
              exit={{ rotateY: 90, scale: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl'
              >
                ✕
              </button>
              <h2 className='text-lg font-bold mb-4 text-center'>Menu</h2>
              <div className='flex justify-center'>
                <Image
                  src='/M1.jpg'
                  alt='Menu'
                  width={400}
                  height={400}
                  className='rounded'
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Branding
