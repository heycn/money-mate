import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Gradient } from "../components/Gradient"
import { TopNav } from "../components/X"
import { useAjax } from '../lib/ajax'
import { TagForm } from "./TagsNewPage/TagForm"
import { comfirmable } from '../lib/comfirmable'

export const TagsEditPage: React.FC = () => {
  const { id } = useParams()
  const { destroy } = useAjax({ showLoading: true, handleError: true })
  const nav = useNavigate()
  const onDelete = comfirmable('确定要删除吗？', async () => {
    if (!id) { throw new Error('id 不能为空') }
    await destroy(`/api/v1/tags/${id}`).catch(error => {
      window.alert('删除失败')
      throw error
    })
    window.alert('删除成功')
    nav('/items/new', { replace: true })
  })

  return (
    <div>
      <Gradient grow-0 shrink-0>
        <TopNav title="编辑标签" icon='back' back path='/items/new' />
      </Gradient>
      <TagForm type="edit" />
      <div px-16px mt-24px >
        <button m-btn bg="#0003" onClick={onDelete}>删除</button>
      </div>
    </div>
  )
}
