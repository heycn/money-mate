import { Gradient } from '../components/Gradient'
import { TopNav } from '../components/TopNav'
import { TagForm } from './TagsNewPage/TagForm'

export const TagsNewPage: React.FC = () => {

  return (
    <div>
      <Gradient grow-0 shrink-0>
        <TopNav title="新建标签" icon='back' back path='/items/new' />
      </Gradient>
      <TagForm type="create" />
    </div>
  )
}

export default TagsNewPage
